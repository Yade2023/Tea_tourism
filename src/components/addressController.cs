using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WebApplication1.Models;

namespace WebApplication1.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class addressController : ControllerBase
    {
        private readonly QAdbContext _context;

        public addressController(QAdbContext context)
        {
            _context = context;
        }

        /// <summary>
        /// 取得所有問答資料（包含分類和問答配對）
        /// </summary>
        [HttpGet]
        [ProducesResponseType(typeof(object), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> GetAllQA()
        {
            try
            {
                var categories = await _context.AccordionCategory
                    .Include(c => c.QAPair)
                    .OrderBy(c => c.Id)
                    .ToListAsync();

                var result = new
                {
                    accordionList = categories.Select(c => new
                    {
                        id = c.Id,
                        title = c.Title,
                        qa = c.QAPair.OrderBy(q => q.Id).Select(q => new
                        {
                            id = q.Id,
                            q = q.Question,
                            a = q.Answer
                        }).ToList()
                    }).ToList()
                };

                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = $"讀取資料時發生錯誤：{ex.Message}" });
            }
        }

        /// <summary>
        /// 取得所有分類列表
        /// </summary>
        [HttpGet("categories")]
        [ProducesResponseType(typeof(object), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> GetCategories()
        {
            try
            {
                var categories = await _context.AccordionCategory
                    .OrderBy(c => c.Id)
                    .Select(c => new
                    {
                        id = c.Id,
                        title = c.Title
                    })
                    .ToListAsync();

                return Ok(new { categories });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = $"讀取分類資料時發生錯誤：{ex.Message}" });
            }
        }

        /// <summary>
        /// 根據分類 ID 取得該分類的所有問答
        /// </summary>
        [HttpGet("category/{id}")]
        [ProducesResponseType(typeof(object), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> GetCategoryById(int id)
        {
            try
            {
                var category = await _context.AccordionCategory
                    .Include(c => c.QAPair)
                    .Where(c => c.Id == id)
                    .FirstOrDefaultAsync();

                if (category == null)
                {
                    return NotFound(new { error = $"找不到 ID 為 {id} 的分類" });
                }

                var result = new
                {
                    id = category.Id,
                    title = category.Title,
                    qa = category.QAPair.OrderBy(q => q.Id).Select(q => new
                    {
                        id = q.Id,
                        q = q.Question,
                        a = q.Answer
                    }).ToList()
                };

                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = $"讀取分類資料時發生錯誤：{ex.Message}" });
            }
        }

        /// <summary>
        /// 取得單一問答配對
        /// </summary>
        [HttpGet("qa/{id}")]
        [ProducesResponseType(typeof(object), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> GetQAById(int id)
        {
            try
            {
                var qa = await _context.QAPair
                    .Include(q => q.Category)
                    .Where(q => q.Id == id)
                    .FirstOrDefaultAsync();

                if (qa == null)
                {
                    return NotFound(new { error = $"找不到 ID 為 {id} 的問答" });
                }

                var result = new
                {
                    id = qa.Id,
                    categoryId = qa.CategoryId,
                    categoryTitle = qa.Category.Title,
                    q = qa.Question,
                    a = qa.Answer
                };

                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = $"讀取問答資料時發生錯誤：{ex.Message}" });
            }
        }

        /// <summary>
        /// 搜尋問答（根據問題或答案關鍵字）
        /// </summary>
        [HttpGet("search")]
        [ProducesResponseType(typeof(object), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> SearchQA([FromQuery] string keyword)
        {
            if (string.IsNullOrWhiteSpace(keyword))
            {
                return BadRequest(new { error = "請提供搜尋關鍵字" });
            }

            try
            {
                var qaList = await _context.QAPair
                    .Include(q => q.Category)
                    .Where(q => q.Question.Contains(keyword) || q.Answer.Contains(keyword))
                    .OrderBy(q => q.CategoryId)
                    .ThenBy(q => q.Id)
                    .Select(q => new
                    {
                        id = q.Id,
                        categoryId = q.CategoryId,
                        categoryTitle = q.Category.Title,
                        q = q.Question,
                        a = q.Answer
                    })
                    .ToListAsync();

                return Ok(new { results = qaList, count = qaList.Count });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = $"搜尋時發生錯誤：{ex.Message}" });
            }
        }
    }
}

