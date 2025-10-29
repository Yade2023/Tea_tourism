using Microsoft.AspNetCore.Mvc;
using System.Text.Json;
using WebApplication1.Models;

namespace WebApplication1.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class addressController : ControllerBase
    {
        private readonly IWebHostEnvironment _environment;

        public addressController(IWebHostEnvironment environment)
        {
            _environment = environment;
        }

        /// <summary>
        /// 取得所有問答資料
        /// </summary>
        [HttpGet]
        [ProducesResponseType(typeof(QAAddress), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public IActionResult GetAddressData()
        {
            var filePath = Path.Combine(_environment.ContentRootPath, "..", "..", "address.json");
            var fullPath = Path.GetFullPath(filePath);

            if (!System.IO.File.Exists(fullPath))
            {
                return NotFound(new { error = "找不到 address.json 檔案" });
            }

            try
            {
                var jsonContent = System.IO.File.ReadAllText(fullPath);
                var addressData = JsonSerializer.Deserialize<QAAddress>(jsonContent, new JsonSerializerOptions
                {
                    PropertyNameCaseInsensitive = true
                });

                if (addressData == null)
                {
                    return NotFound(new { error = "無法解析 address.json 檔案" });
                }

                return Ok(addressData);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = $"讀取檔案時發生錯誤：{ex.Message}" });
            }
        }

        /// <summary>
        /// 取得特定分類的問答資料
        /// </summary>
        [HttpGet("{index}")]
        [ProducesResponseType(typeof(AccordionCategory), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public IActionResult GetCategoryByIndex(int index)
        {
            var filePath = Path.Combine(_environment.ContentRootPath, "..", "..", "address.json");
            var fullPath = Path.GetFullPath(filePath);

            if (!System.IO.File.Exists(fullPath))
            {
                return NotFound(new { error = "找不到 address.json 檔案" });
            }

            try
            {
                var jsonContent = System.IO.File.ReadAllText(fullPath);
                var addressData = JsonSerializer.Deserialize<QAAddress>(jsonContent, new JsonSerializerOptions
                {
                    PropertyNameCaseInsensitive = true
                });

                if (addressData?.AccordionList == null || index < 0 || index >= addressData.AccordionList.Count)
                {
                    return NotFound(new { error = $"找不到索引 {index} 的分類" });
                }

                return Ok(addressData.AccordionList[index]);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = $"讀取檔案時發生錯誤：{ex.Message}" });
            }
        }
    }
}
