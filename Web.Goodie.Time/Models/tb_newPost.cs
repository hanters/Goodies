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
    
    public partial class tb_newPost
    {
        public int id_newPost { get; set; }
        public string title { get; set; }
        public string tags { get; set; }
        public string introduction { get; set; }
        public string content { get; set; }
        public string image { get; set; }
        public byte[] active { get; set; }
        public Nullable<int> id_user_cadm { get; set; }
        public Nullable<System.DateTime> ts_user_cadm { get; set; }
        public Nullable<int> id_user_manu { get; set; }
        public Nullable<System.DateTime> ts_user_manu { get; set; }
        public Nullable<int> id_status { get; set; }
        public string url { get; set; }
    
        public virtual tb_status tb_status { get; set; }
    }
}
