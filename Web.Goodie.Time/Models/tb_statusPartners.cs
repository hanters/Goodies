//------------------------------------------------------------------------------
// <auto-generated>
//     This code was generated from a template.
//
//     Manual changes to this file may cause unexpected behavior in your application.
//     Manual changes to this file will be overwritten if the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

namespace Web.Goodie.Time.Models
{
    using System;
    using System.Collections.Generic;
    
    public partial class tb_statusPartners
    {
        public tb_statusPartners()
        {
            this.tb_partners = new HashSet<tb_partners>();
        }
    
        public int id_statusPartners { get; set; }
        public string statusPartners { get; set; }
    
        public virtual ICollection<tb_partners> tb_partners { get; set; }
    }
}