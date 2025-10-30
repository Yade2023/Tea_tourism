using System;
using System.Collections.Generic;

namespace WebApplication1.Models;

public partial class AccordionCategory
{
    public int Id { get; set; }

    public string Title { get; set; } = null!;

    public virtual ICollection<QAPair> QAPair { get; set; } = new List<QAPair>();
}
