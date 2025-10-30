using System;
using System.Collections.Generic;

namespace WebApplication1.Models;

public partial class QAPair
{
    public int Id { get; set; }

    public int CategoryId { get; set; }

    public string Question { get; set; } = null!;

    public string Answer { get; set; } = null!;

    public virtual AccordionCategory Category { get; set; } = null!;
}
