using System;
using System.Web;
using System.Text;
using System.Security.Cryptography;


namespace Web.Frooty.Admin.Util
{
    public sealed class SessaoUtil
    {
        #region Variaveis

        public const string idSessionUsuario = "uSu3foeVCdeee";

        #endregion

        #region Construtor

        public SessaoUtil()
        {
        }

        #endregion

        #region Propriedades
        
        public string Usuario { get; set; }
        public DateTime DataLogin { get; set; }

        #endregion

        #region metodos

        public static void Salvar(string Id, object Objeto)
        {
            if (HttpContext.Current.Session[idSessionUsuario + Id] == null)
            {
                HttpContext.Current.Session.Add(idSessionUsuario + Id, Objeto);
            }
            else
                HttpContext.Current.Session[idSessionUsuario + Id] = Objeto;
        }

        public static void SalvarSession(string Id, object Objeto)
        {
            if (HttpContext.Current.Session[Id] == null)
            {
                HttpContext.Current.Session.Add(Id, Objeto);
            }
            else
                HttpContext.Current.Session[Id] = Objeto;
        }

        public static void Limpar(string Id)
        {
            if (HttpContext.Current.Session[Id] != null)
            {
                HttpContext.Current.Session[Id] = null;
            }
        }

        public static void Limpar()
        {
            if (HttpContext.Current.Session[idSessionUsuario] != null)
            {
                HttpContext.Current.Session[idSessionUsuario] = null;
            }
        }

        public static SessaoUtil Current 
        { 
            get 
            {
                if (HttpContext.Current.Session[SessaoUtil.idSessionUsuario] == null)
                    HttpContext.Current.Session[SessaoUtil.idSessionUsuario] = new SessaoUtil();

                return (SessaoUtil)HttpContext.Current.Session[SessaoUtil.idSessionUsuario]; 
            } 
        }

        public static bool sessaoPerdida()
        {
            if (HttpContext.Current.Session[idSessionUsuario] == null)
            {
                return true;
            }
            else
            {
                return false;
            }
        }

        public static void SalvarUsuario(Object Usuario)
        {
            HttpContext.Current.Session.Add(idSessionUsuario, Usuario);

        }

        public static object Recuperar(string Id)
        {
            if (HttpContext.Current.Session[Id] != null)
            {
                return HttpContext.Current.Session[Id];
            }
            else
                return null;
        }

        public static object Recuperar()
        {
            if (HttpContext.Current.Session[idSessionUsuario] != null)
            {
                return HttpContext.Current.Session[idSessionUsuario];
               
            }
            else
                return null;
        }

        public static string Md5Hash(string input)
        {
            MD5 md5Hash = MD5.Create();

            // Convert the input string to a byte array and compute the hash. 
            byte[] data = md5Hash.ComputeHash(Encoding.UTF8.GetBytes(input));

            // Create a new Stringbuilder to collect the bytes 
            // and create a string.
            StringBuilder sBuilder = new StringBuilder();

            // Loop through each byte of the hashed data  
            // and format each one as a hexadecimal string. 
            for (int i = 0; i < data.Length; i++)
            {
                sBuilder.Append(data[i].ToString("x2"));
            }

            // Return the hexadecimal string. 
            return sBuilder.ToString();
        }

        #endregion

    }
}
