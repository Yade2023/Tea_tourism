using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WebApplication1.Models;
using System.Text;

namespace WebApplication1.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class addressController : ControllerBase
    {
        private readonly IWebHostEnvironment _env;
        private readonly QAdbContext _context;

        public addressController(QAdbContext context, IWebHostEnvironment env)
        {
            _context = context;
            _env = env;
        }

        public record CreateContactDto(string Name, string Email, string Message);

        /// <summary>
        /// 新增聯絡訊息（路由：api/address/contact）
        /// </summary>
        [HttpPost("contact")]
        [ProducesResponseType(typeof(object), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> CreateContact([FromBody] CreateContactDto dto)
        {
            if (dto == null)
            {
                return BadRequest(new { error = "請提供表單資料" });
            }

            // 驗證必填欄位
            if (string.IsNullOrWhiteSpace(dto.Name))
            {
                return BadRequest(new { error = "請填寫您的名稱" });
            }

            if (string.IsNullOrWhiteSpace(dto.Email))
            {
                return BadRequest(new { error = "請填寫您的電子郵件" });
            }

            // 驗證電子郵件格式
            if (!System.Text.RegularExpressions.Regex.IsMatch(dto.Email, @"^[^@\s]+@[^@\s]+\.[^@\s]+$"))
            {
                return BadRequest(new { error = "請輸入有效的電子郵件地址" });
            }

            if (string.IsNullOrWhiteSpace(dto.Message))
            {
                return BadRequest(new { error = "請填寫內容（意見 / 聯絡事宜 / 其他）" });
            }

            try
            {
                var entity = new ContactMessages
                {
                    Name = dto.Name.Trim(),
                    Email = dto.Email.Trim(),
                    Message = dto.Message.Trim(),
                    CreatedAt = DateTime.UtcNow
                };

                _context.ContactMessages.Add(entity);
                await _context.SaveChangesAsync();

                return Ok(new 
                { 
                    success = true,
                    message = "您的訊息已成功送出，我們將盡快與您聯繫！",
                    id = entity.Id 
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = $"儲存聯絡訊息時發生錯誤：{ex.Message}" });
            }
        }

        /// <summary>
        /// 返回包含後端資料的 HTML 頁面（路由：api/address/page）
        /// </summary>
        [HttpGet("page")]
        [Produces("text/html")]
        public async Task<ContentResult> GetAddressPage()
        {
            try
            {
                // 取得所有問答資料
                var categories = await _context.AccordionCategory
                    .Include(c => c.QAPair)
                    .OrderBy(c => c.Id)
                    .ToListAsync();

                // 讀取 HTML 模板檔案
                var htmlPath = Path.Combine(_env.ContentRootPath, "src", "components", "address.html");
                if (!System.IO.File.Exists(htmlPath))
                {
                    htmlPath = Path.Combine(_env.WebRootPath ?? _env.ContentRootPath, "components", "address.html");
                }

                string htmlTemplate = string.Empty;
                if (System.IO.File.Exists(htmlPath))
                {
                    htmlTemplate = await System.IO.File.ReadAllTextAsync(htmlPath, Encoding.UTF8);
                }
                else
                {
                    // 如果找不到檔案，返回基本 HTML 結構
                    htmlTemplate = GetDefaultHtmlTemplate();
                }

                // 生成手風琴 HTML
                var accordionHtml = new StringBuilder();
                foreach (var category in categories)
                {
                    accordionHtml.AppendLine($@"                    <div class=""accordion-item"">");
                    accordionHtml.AppendLine($@"                        <div class=""accordion-header"">");
                    accordionHtml.AppendLine($@"                            <h3>{category.Title}</h3>");
                    accordionHtml.AppendLine($@"                            <span class=""accordion-icon"">+</span>");
                    accordionHtml.AppendLine($@"                        </div>");
                    accordionHtml.AppendLine($@"                        <div class=""accordion-content"">");

                    foreach (var qa in category.QAPair.OrderBy(q => q.Id))
                    {
                        accordionHtml.AppendLine($@"                            <div class=""qa-item"">");
                        accordionHtml.AppendLine($@"                                <div class=""question"">Q：{qa.Question}</div>");
                        accordionHtml.AppendLine($@"                                <div class=""answer"">A：{qa.Answer}</div>");
                        accordionHtml.AppendLine($@"                            </div>");
                    }

                    accordionHtml.AppendLine($@"                        </div>");
                    accordionHtml.AppendLine($@"                    </div>");
                }

                // 替換 HTML 中的手風琴內容
                // 尋找手風琴開始標記
                var accordionStartMarker = "<div class=\"accordion\">";
                var accordionStartIndex = htmlTemplate.IndexOf(accordionStartMarker);
                
                if (accordionStartIndex >= 0)
                {
                    // 找到手風琴開始標記後的第一個 </div>（這是 accordion 的結束標記）
                    // 我們需要找到與 <div class="accordion"> 配對的 </div>
                    var startPos = accordionStartIndex + accordionStartMarker.Length;
                    
                    // 計算嵌套層級來找到正確的結束標記
                    int depth = 1;
                    int pos = startPos;
                    int endPos = startPos;
                    
                    while (pos < htmlTemplate.Length && depth > 0)
                    {
                        var nextDivOpen = htmlTemplate.IndexOf("<div", pos);
                        var nextDivClose = htmlTemplate.IndexOf("</div>", pos);
                        
                        if (nextDivClose < 0) break;
                        
                        if (nextDivOpen > 0 && nextDivOpen < nextDivClose)
                        {
                            depth++;
                            pos = nextDivOpen + 4;
                        }
                        else
                        {
                            depth--;
                            if (depth == 0)
                            {
                                endPos = nextDivClose;
                                break;
                            }
                            pos = nextDivClose + 6;
                        }
                    }
                    
                    if (endPos > startPos)
                    {
                        // 替換手風琴內容
                        var before = htmlTemplate.Substring(0, startPos);
                        var after = htmlTemplate.Substring(endPos);
                        htmlTemplate = before + "\n" + accordionHtml.ToString().TrimEnd() + "\n                " + after;
                    }
                }

                return Content(htmlTemplate, "text/html; charset=utf-8");
            }
            catch (Exception ex)
            {
                return Content($"<html><body><h1>錯誤</h1><p>載入頁面時發生錯誤：{ex.Message}</p></body></html>", "text/html; charset=utf-8");
            }
        }

        private string GetDefaultHtmlTemplate()
        {
            return @"<!DOCTYPE html>
<html lang=""zh-Hant"">
<head>
    <meta charset=""UTF-8"">
    <meta name=""viewport"" content=""width=device-width, initial-scale=1.0"">
    <link rel=""stylesheet"" href=""/components/address.css"">
    <title>聯絡我們</title>
</head>
<body>
    <div class=""container"">
        <div class=""concepts"">
            <div class=""qa-section"">
                <h2 class=""qa-title"">🍵 茶類常見問答精選</h2>
                <div class=""accordion"">
                    <!-- 動態生成的問答內容 -->
                </div>
            </div>
            <h2 class=""h2text"" style=""text-align: center; font-size: 2rem; color: #4CAF50; margin-top: 2rem;"">聯絡我們</h2>
            <form action=""#"" method=""POST"" id=""contactForm"" style=""max-width: 800px; margin: 0 auto; background: #f9f9f9; padding: 1.5rem; border-radius: 8px; box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);"">
                <div class=""form-group"" style=""margin-bottom: 1rem;"">
                    <label style=""display: block; font-weight: bold; margin-bottom: 0.5rem;"">您的名稱 *</label>
                    <input type=""text"" id=""name"" name=""name"" required style=""width: 100%; padding: 0.5rem; border: 1px solid #ccc; border-radius: 4px;"">
                </div>
                <div class=""form-group"" style=""margin-bottom: 1rem;"">
                    <label style=""display: block; font-weight: bold; margin-bottom: 0.5rem;"">您的電子郵件 *</label>
                    <input type=""email"" id=""email"" name=""email"" required style=""width: 100%; padding: 0.5rem; border: 1px solid #ccc; border-radius: 4px;"">
                </div>
                <div class=""form-group"" style=""margin-bottom: 1rem;"">
                    <label style=""display: block; font-weight: bold; margin-bottom: 0.5rem;"">內容（意見 / 聯絡事宜 / 其他） *</label>
                    <textarea id=""message"" name=""message"" required style=""width: 100%; padding: 0.5rem; border: 1px solid #ccc; border-radius: 4px; height: 150px;""></textarea>
                </div>
                <div class=""submit-btn"" style=""text-align: center;"">
                    <button type=""submit"" style=""background: #4CAF50; color: white; padding: 0.75rem 1.5rem; border: none; border-radius: 4px; cursor: pointer; font-size: 1rem;"">發送</button>
                </div>
            </form>
        </div>
    </div>
    <script src=""/components/address.js""></script>
</body>
</html>";
        }
    }
}
