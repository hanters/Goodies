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
    
    public partial class tb_country
    {
        public tb_country()
        {
            this.tb_states = new HashSet<tb_states>();
        }
    
        public int id_country { get; set; }
        public string ds_name { get; set; }
        public string ds_codigo { get; set; }
        public string fl_active { get; set; }
        public Nullable<int> id_user_cadm { get; set; }
        public Nullable<System.DateTime> ts_user_cadm { get; set; }
        public Nullable<int> id_user_manu { get; set; }
        public Nullable<System.DateTime> ts_user_manu { get; set; }
    
        public virtual ICollection<tb_states> tb_states { get; set; }
    }
}
