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
    
    public partial class td_brands
    {
        public td_brands()
        {
            this.td_Products = new HashSet<td_Products>();
        }
    
        public int id_brands { get; set; }
        public string name { get; set; }
        public string description { get; set; }
        public string LogoTipoImgUrl { get; set; }
        public string PosterImgUrl { get; set; }
        public string fl_active { get; set; }
        public string url { get; set; }
    
        public virtual ICollection<td_Products> td_Products { get; set; }
    }
}
