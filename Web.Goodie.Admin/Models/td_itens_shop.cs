//------------------------------------------------------------------------------
// <auto-generated>
//     This code was generated from a template.
//
//     Manual changes to this file may cause unexpected behavior in your application.
//     Manual changes to this file will be overwritten if the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

namespace Web.Frooty.Admin.Models
{
    using System;
    using System.Collections.Generic;
    
    public partial class td_itens_shop
    {
        public int id_itens { get; set; }
        public int id_products { get; set; }
        public int id_shop { get; set; }
        public Nullable<int> amount { get; set; }
        public Nullable<decimal> total { get; set; }
        public Nullable<decimal> weight_total { get; set; }
        public Nullable<decimal> discount_total { get; set; }
        public Nullable<decimal> unit_price_rules { get; set; }
        public string rules { get; set; }
        public Nullable<System.DateTime> date { get; set; }
    
        public virtual tb_shop tb_shop { get; set; }
        public virtual td_Products td_Products { get; set; }
    }
}
