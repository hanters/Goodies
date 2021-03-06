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
    
    public partial class tb_partners
    {
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2214:DoNotCallOverridableMethodsInConstructors")]
        public tb_partners()
        {
            this.tb_shop = new HashSet<tb_shop>();
        }
    
        public int id_partners { get; set; }
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
        public Nullable<int> id_state { get; set; }
        public string state { get; set; }
        public Nullable<int> id_user_cadm { get; set; }
        public Nullable<System.DateTime> ts_user_cadm { get; set; }
        public Nullable<int> id_user_manu { get; set; }
        public Nullable<System.DateTime> ts_user_manu { get; set; }
        public Nullable<bool> active { get; set; }
        public Nullable<int> id_business { get; set; }
        public Nullable<int> id_statusPartners { get; set; }
        public string changePassWord { get; set; }
    
        public virtual tb_business tb_business { get; set; }
        public virtual tb_statusPartners tb_statusPartners { get; set; }
        public virtual tb_states tb_states { get; set; }
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<tb_shop> tb_shop { get; set; }
    }
}
