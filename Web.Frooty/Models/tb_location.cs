//------------------------------------------------------------------------------
// <auto-generated>
//     This code was generated from a template.
//
//     Manual changes to this file may cause unexpected behavior in your application.
//     Manual changes to this file will be overwritten if the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

namespace Web.Frooty.Models
{
    using System;
    using System.Collections.Generic;
    
    public partial class tb_location
    {
        public int id_location { get; set; }
        public string name { get; set; }
        public string lastname { get; set; }
        public Nullable<System.DateTime> birthday { get; set; }
        public string email { get; set; }
        public string password { get; set; }
        public string company { get; set; }
        public string taxID { get; set; }
        public string phone { get; set; }
        public string address { get; set; }
        public string zipCode { get; set; }
        public string city { get; set; }
        public string state { get; set; }
        public Nullable<int> id_user_cadm { get; set; }
        public Nullable<System.DateTime> ts_user_cadm { get; set; }
        public Nullable<int> id_user_manu { get; set; }
        public Nullable<System.DateTime> ts_user_manu { get; set; }
        public Nullable<bool> active { get; set; }
    }
}
