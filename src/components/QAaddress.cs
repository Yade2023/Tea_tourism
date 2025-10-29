using System.Text.Json.Serialization;

namespace WebApplication1.Models
{
    /// <summary>
    /// 問答資料的主要模型類別
    /// </summary>
    public class QAAddress
    {
        [JsonPropertyName("accordionList")]
        public List<AccordionCategory> AccordionList { get; set; } = new List<AccordionCategory>();
    }

    /// <summary>
    /// 手風琴分類項目
    /// </summary>
    public class AccordionCategory
    {
        [JsonPropertyName("title")]
        public string Title { get; set; } = string.Empty;

        [JsonPropertyName("qa")]
        public List<QAPair> QA { get; set; } = new List<QAPair>();
    }

    /// <summary>
    /// 問答配對
    /// </summary>
    public class QAPair
    {
        [JsonPropertyName("q")]
        public string Question { get; set; } = string.Empty;

        [JsonPropertyName("a")]
        public string Answer { get; set; } = string.Empty;
    }
}

