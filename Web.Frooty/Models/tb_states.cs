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
    
    public partial class tb_states
    {
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2214:DoNotCallOverridableMethodsInConstructors")]
        public tb_states()
        {
            this.tb_grupo_shipping = new HashSet<tb_grupo_shipping>();
            this.tb_partners = new HashSet<tb_partners>();
        }
    
        public int id_state { get; set; }
        public int id_country { get; set; }
        public string ds_name { get; set; }
        public string ds_cod { get; set; }
        public string fl_active { get; set; }
        public Nullable<int> id_user_cadm { get; set; }
        public Nullable<System.DateTime> ts_user_cadm { get; set; }
        public Nullable<int> id_user_manu { get; set; }
        public Nullable<System.DateTime> ts_user_manu { get; set; }
    
        public virtual tb_country tb_country { get; set; }
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<tb_grupo_shipping> tb_grupo_shipping { get; set; }
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<tb_partners> tb_partners { get; set; }
    }
}
