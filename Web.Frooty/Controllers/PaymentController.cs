using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Net;
using System.Text;
using System.Net;
using System.IO;
using System.Configuration;
using System.Web.Configuration;
using System.Web.Mvc;
using Web.Frooty.Models;
using Web.Frooty.Util;

namespace Web.Frooty.Controllers
{
    public class PaymentController : Controller
    {
        //
        // GET: /Payment/

        private frootyacai_siteEntities db = new frootyacai_siteEntities();

        public ActionResult Index()
        {
            var formVals = new Dictionary<string, string>();        
            formVals.Add("cmd", "_notify-validate");
            
            string response = GetPayPalResponse(formVals);
            
            if (response == "VERIFIED")
            {
                 string transactionID = Request["txn_id"];
                 string sAmountPaid = Request["mc_gross"]; 
                 string deviceID = Request["custom"];
                 string paymentStaus = Request["payment_status"];
                 string paymentDate = Request["payment_date"];
                 string payment = Request["payment_gross"];
             
                 if (deviceID != null)
                 {
                     var id_shop = Convert.ToInt32(Security.Decrypt(deviceID.Trim()));

                     if (id_shop > 0)
                     {

                         var result = (from a in db.tb_shop
                                       join b in db.tb_partners on a.id_partners equals b.id_partners
                                       where a.id_shop == id_shop
                                       select new
                                       {
                                           b.name,
                                           b.lastname,
                                           b.email,
                                           b.phone,

                                       }).FirstOrDefault();

                         if (result != null)
                         {

                             string pathForSaving = Server.MapPath("~/Views/Email/MailCheckoutSuccess.txt");
                             string text = System.IO.File.ReadAllText(pathForSaving);
                             string tabela = "";
                             string tipo = "";


                             //if (paymentStaus.Trim() == "Completed")
                             //{
                             var result_item = (from a in db.td_itens_shop
                                                join b in db.td_Products on a.id_products equals b.id_products
                                                where a.id_shop == id_shop && b.id_status == 2
                                                select new
                                                {
                                                    a.id_itens,
                                                    a.id_products,
                                                    a.amount,
                                                    b.name,
                                                    b.flavour,
                                                    b.weight,
                                                    b.price,
                                                    a.weight_total,
                                                    a.total,
                                                    a.discount_total,
                                                    a.unit_price_rules
                                                }).ToList();


                             for (int i = 0; i < result_item.Count; i++)
                             {

                                 if ((i % 2) == 1)
                                 {
                                     tipo = "odd";
                                 }
                                 else
                                 {
                                     tipo = "even";
                                 }

                                 tabela += "<tr role=\"" + tipo + "\" class=\"odd\">" +
                                                 "<td style=\"border-bottom: 1px solid #CCC; color: #666\"> " + result_item[i].name + " " + result_item[i].weight + " oz " + result_item[i].flavour + "</td>" +
                                                 "<td style=\"border-bottom: 1px solid #CCC; color: #666\"> " + result_item[i].amount + "</td>" +
                                                 "<td style=\"border-bottom: 1px solid #CCC; color: #666\"> " + (result_item[i].unit_price_rules == null ? string.Format("{0:n2}", result_item[i].price) : string.Format("{0:n2}", result_item[i].unit_price_rules)) + "</td>" +
                                                 "<td style=\"border-bottom: 1px solid #CCC; color: #666\"> " + (result_item[i].discount_total == null ? string.Format("{0:n2}", result_item[i].total) : string.Format("{0:n2}", result_item[i].discount_total)) + "</td>" +
                                             "</tr>";
                             }


                             var tbShop = (from a in db.tb_shop where a.id_shop == id_shop select a).FirstOrDefault();

                             if (tbShop != null)
                             {
                                 tbShop.id_status = 3;
                                 tbShop.date_payment = paymentDate;
                                 tbShop.id_transaction = transactionID;
                                 tbShop.status_payment = paymentStaus;

                                 db.SaveChanges();

                                 Email.Send(result.name, result.email, "Payment confirmation", text.Replace("%NAME%", result.name).Replace("%LASTNAME%", result.lastname).Replace("%TIPO%", tabela).Replace("%ImagemHeadEmail%", WebConfigurationManager.AppSettings["ImagemHeadEmail"]).Replace("%ImagemFooterEmail%", WebConfigurationManager.AppSettings["ImagemFooterEmail"]));
                                
                                 string content = "Name :" + result.name +
                                                  "ID Shop:" +  id_shop +
                                                  "<br> Email :" + result.email +
                                                  "<br> Phone :" + result.phone +
                                                  "<br> Payment amount :" + payment +
                                                  "<br> Payment Status: " + paymentStaus + 
                                                  "<br> Transaction ID :" + transactionID + 
                                                  "<br> Payment Date :" + paymentDate;

                                 Email.Send("Contact", result.email, "Payment Notification", content);
                             }
                             //}
                             //else
                             //{
                             //    var tbShop = (from a in db.tb_shop where a.id_shop == id_shop select a).FirstOrDefault();
                             //    if (tbShop != null)
                             //    {
                                     //string content_ = "Name :" + result.name +
                                     //   "ID Shop:" + id_shop +
                                     //   "<br> Email :" + result.email +
                                     //   "<br> Phone :" + result.phone +
                                     //   "<br> Payment amount :" + payment +
                                     //   "<br> Payment Status: " + paymentStaus +
                                     //   "<br> Transaction ID :" + transactionID +
                                     //   "<br> Payment Date :" + paymentDate;

                                     //   Email.Send("Contact", result.email, "Payment Notification", content_);
                             //    }
                             //}                      

                         }

                     }
                 }
          
            }
            else
            {
                //error
            }
            
            return View();
        }

        string GetPayPalResponse(Dictionary<string, string> formVals)
        {

            string paypalUrl = WebConfigurationManager.AppSettings["UrlPaypall"];

            ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;

            HttpWebRequest req = (HttpWebRequest)WebRequest.Create(paypalUrl);

            // Set values for the request back
            req.Method = "POST";
            req.ContentType = "application/x-www-form-urlencoded";

            byte[] param = Request.BinaryRead(Request.ContentLength);
            string strRequest = Encoding.ASCII.GetString(param);

            StringBuilder sb = new StringBuilder();
            sb.Append(strRequest);

            foreach (string key in formVals.Keys)
            {
                sb.AppendFormat("&{0}={1}", key, formVals[key]);
            }
            strRequest += sb.ToString();
            req.ContentLength = strRequest.Length;

            //for proxy
            //WebProxy proxy = new WebProxy(new Uri("http://urlort#");
            //req.Proxy = proxy;
            //Send the request to PayPal and get the response
            string response = "";
            using (StreamWriter streamOut = new StreamWriter(req.GetRequestStream(), System.Text.Encoding.ASCII))
            {

                streamOut.Write(strRequest);
                streamOut.Close();
                using (StreamReader streamIn = new StreamReader(req.GetResponse().GetResponseStream()))
                {
                    response = streamIn.ReadToEnd();
                }
            }
            
            return response;
        }

    }
}
