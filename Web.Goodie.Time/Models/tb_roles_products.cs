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
    
    public partial class tb_roles_products
    {
        public int id_role { get; set; }
        public int id_products { get; set; }
        public int id_status { get; set; }
        public Nullable<decimal> weight_bronze { get; set; }
        public Nullable<decimal> price_bronze { get; set; }
        public Nullable<decimal> weight_silver { get; set; }
        public Nullable<decimal> price_silver { get; set; }
        public Nullable<decimal> weigth_gold { get; set; }
        public Nullable<decimal> price_gold { get; set; }
        public Nullable<int> id_user_cadm { get; set; }
        public Nullable<System.DateTime> ts_user_cadm { get; set; }
        public Nullable<int> id_user_manu { get; set; }
        public Nullable<System.DateTime> ts_user_manu { get; set; }
    
        public virtual td_Products td_Products { get; set; }
        public virtual tb_status_roles tb_status_roles { get; set; }
    }
}
