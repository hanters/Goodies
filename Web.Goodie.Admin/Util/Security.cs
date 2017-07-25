using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Security;
using System.Security.Cryptography;
using System.Runtime.InteropServices;

namespace Web.Frooty.Admin.Util
{
    public sealed class Security
    {

        private static byte[] GetKey(string password)
        {
            string pwd = null;

            if (Encoding.UTF8.GetByteCount(password) < 24)
            {
                pwd = password.PadRight(24, ' ');
            }
            else
            {
                pwd = password.Substring(0, 24);
            }

            return Encoding.UTF8.GetBytes(pwd);
        }

        public static string Encrypt(string data, string password)
        {
            TripleDESCryptoServiceProvider DES = new TripleDESCryptoServiceProvider();

            DES.Mode = CipherMode.ECB;
            DES.Key = GetKey(password);

            DES.Padding = PaddingMode.PKCS7;
            ICryptoTransform DESEncrypt = DES.CreateEncryptor();
            Byte[] Buffer = ASCIIEncoding.ASCII.GetBytes(data);

            return Convert.ToBase64String(DESEncrypt.TransformFinalBlock(Buffer, 0, Buffer.Length));

        }

        public static string Encrypt(string data)
        {
            return Encrypt(data, "[09iqC]L(9Bh");
        }

        public static string Decrypt(string data)
        {
            return Decrypt(data, "[09iqC]L(9Bh");
        }

        public static string Decrypt(string data, string password)
        {
            try
            {
                TripleDESCryptoServiceProvider DES = new TripleDESCryptoServiceProvider();

                DES.Mode = CipherMode.ECB;
                DES.Key = GetKey(password);

                DES.Padding = PaddingMode.PKCS7;
                ICryptoTransform DESEncrypt = DES.CreateDecryptor();
                Byte[] Buffer = Convert.FromBase64String(data);

                return Encoding.UTF8.GetString(DESEncrypt.TransformFinalBlock(Buffer, 0, Buffer.Length));
            }
            catch
            {
                throw new ArgumentException("Chave errada, Favor colocar a certa");
            }

        }
    }
}