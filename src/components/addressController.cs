using Microsoft.AspNetCore.Mvc;
using System.Text.Json;

namespace WebApplication1.Controllers
{
    public class addressController : Controller
    {
        private readonly IWebHostEnvironment _environment;

        public addressController(IWebHostEnvironment environment)
        {
            _environment = environment;
        }

        public IActionResult Index()
        {
            var filePath = Path.Combine(_environment.ContentRootPath, "..", "..", "address.json");
            var fullPath = Path.GetFullPath(filePath);

            if (!System.IO.File.Exists(fullPath))
            {
                return Content("找不到 address.json 檔案");
            }

            var jsonContent = System.IO.File.ReadAllText(fullPath);
            var addressData = JsonSerializer.Deserialize<AddressData>(jsonContent, new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true
            });

            ViewBag.AddressData = addressData;
            return View();
        }

        [HttpGet]
        public IActionResult GetAddressData()
        {
            var filePath = Path.Combine(_environment.ContentRootPath, "..", "..", "address.json");
            var fullPath = Path.GetFullPath(filePath);

            if (!System.IO.File.Exists(fullPath))
            {
                return NotFound(new { error = "找不到 address.json 檔案" });
            }

            var jsonContent = System.IO.File.ReadAllText(fullPath);
            var addressData = JsonSerializer.Deserialize<AddressData>(jsonContent, new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true
            });

            return Json(addressData);
        }
    }

    // 內嵌的資料模型類別
    public class AddressData
    {
        public List<AccordionItem> AccordionList { get; set; } = new List<AccordionItem>();
    }

    public class AccordionItem
    {
        public string Title { get; set; } = string.Empty;
        public List<QAItem> QA { get; set; } = new List<QAItem>();
    }

    public class QAItem
    {
        public string Q { get; set; } = string.Empty;
        public string A { get; set; } = string.Empty;
    }
}
