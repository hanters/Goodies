using System;
using System.Drawing;
using System.Drawing.Imaging;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Web.Frooty.Admin.Models;
using Web.Frooty.Admin.Util;

namespace Web.Frooty.Admin.Controllers
{
    public class ProductsController : WebPageBase
    {
        //
        // GET: /Products/

        private frootyacai_siteEntities db = new frootyacai_siteEntities();

        private static int W_FixedSize = 1024;
        private static int H_FixedSize = 200;

        public ActionResult Index()
        {
            var result = (from a in db.td_brands
                          where a.id_brands != 1
                          select new
                          {
                              a.id_brands,
                              a.name
                          }).ToList();

            return View(result);
        }

        public JsonResult SelectProducts()
        {

            try
            {

                var result = (from a in db.td_Products
                              join b in db.tb_status_products on a.id_status equals b.id_status
                              join c in db.td_brands on a.id_brands equals c.id_brands
                              where a.fl_active == "1" && c.id_brands != 1
                              select new
                              {
                                  a.id_products,
                                  a.id_brands,
                                  a.name,
                                  a.flavour,
                                  a.weight,
                                  a.price,
                                  b.description,
                                  nameBrands = c.name
                              }).ToList();

                return Json(new { result }, JsonRequestBehavior.AllowGet);
            }
            catch
            {
                return Json(new { result = false }, JsonRequestBehavior.AllowGet);
            }

        }

        public JsonResult ListStatus()
        {
            try
            {
                var result = (from a in db.tb_status_products
                              select new
                              {
                                  a.id_status,
                                  a.description
                              }).ToList();

                return Json(new { result }, JsonRequestBehavior.AllowGet);
            }
            catch
            {
                return Json(new { result = false }, JsonRequestBehavior.AllowGet);
            }

        }

        [HttpPost]
        public JsonResult EditProducts(int id)
        {
            try
            {
                var result = (from a in db.td_Products
                              where a.id_products == id

                              select new
                              {
                                  a.id_products,
                                  a.id_brands,
                                  a.name,
                                  a.flavour,
                                  a.weight,
                                  a.price,
                                  a.id_status,
                                  a.picture,
                                  a.description

                              }).ToList();

                return Json(new { result }, JsonRequestBehavior.AllowGet);
            }
            catch
            {

                return Json(new { result = false }, JsonRequestBehavior.AllowGet);
            }

        }

        [HttpPost]
        [ValidateInput(false)]
        public JsonResult AddProducts(td_Products dados)
        {
            try
            {
                dados.fl_active = "1";
                dados.id_user_cadm = Convert.ToInt32(SessaoUtil.Recuperar("id_login"));
                dados.ts_user_cadm = DateTime.Now;
                dados.id_user_manu = Convert.ToInt32(SessaoUtil.Recuperar("id_login"));
                dados.ts_user_manu = DateTime.Now;
                db.td_Products.Add(dados);

                db.SaveChanges();

                return Json(new { success = true }, JsonRequestBehavior.AllowGet);
            }
            catch
            {
                return Json(new { success = false }, JsonRequestBehavior.AllowGet);
            }
        }

        [HttpPost]
        [ValidateInput(false)]
        public JsonResult UpdateProducts(td_Products dados)
        {
            try
            {
                var id_products = dados.id_products;
                var result = (from a in db.td_Products where a.id_products == id_products select a).FirstOrDefault();

                if (result != null)
                {
                    result.id_brands = dados.id_brands;
                    result.name = dados.name;
                    result.flavour = dados.flavour;
                    result.weight = dados.weight;
                    result.price = dados.price;
                    result.id_status = dados.id_status;
                    result.picture = dados.picture;
                    result.description = dados.description;
                    result.id_user_manu = Convert.ToInt32(SessaoUtil.Recuperar("id_login"));
                    result.ts_user_manu = DateTime.Now;

                    db.SaveChanges();
                }


                return Json(new { success = true }, JsonRequestBehavior.AllowGet);
            }
            catch
            {
                return Json(new { success = false }, JsonRequestBehavior.AllowGet);
            }
        }

        public JsonResult Discard(int id_products)
        {
            try
            {
                var result = (from a in db.td_Products where a.id_products == id_products select a).FirstOrDefault();

                if (result != null)
                {
                    result.fl_active = "0";
                    result.id_user_manu = Convert.ToInt32(SessaoUtil.Recuperar("id_login"));
                    result.ts_user_manu = DateTime.Now;
                    db.SaveChanges();
                }

                return Json(new { success = true }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {

                return Json(new { success = false, msg = ex.Message }, JsonRequestBehavior.AllowGet);
            }

        }

        public virtual ActionResult UploadFile()
        {
            HttpPostedFileBase myFile = Request.Files["imageproduct"];
            Resize resize = new Resize();

            if (myFile != null && myFile.ContentLength != 0)
            {
                string pathForSaving = Server.MapPath("~/Content/Images/Uploads/Products");
                if (this.CreateFolderIfNeeded(pathForSaving))
                {
                    try
                    {
                        char[] chars = new char[1];
                        chars[0] = '.';
                        string[] array = myFile.FileName.Split(new string[] { "." }, StringSplitOptions.None);

                        var name = "Products_" + DateTime.Now.ToString().Replace("/", "").Replace(":", "").Trim() + "." + array[1];

                        myFile.SaveAs(pathForSaving + "/" + name);

                        return Json(new { isUploaded = true, message = name }, "text/html");
                    }
                    catch (Exception ex)
                    {
                        return Json(new { isUploaded = false, message = ex.ToString() }, "text/html");
                    }
                }
            }

            return Json(new { isUploaded = false, message = "Error" }, "text/html");
        }

        private bool CreateFolderIfNeeded(string path)
        {
            bool result = true;
            if (!Directory.Exists(path))
            {
                try
                {
                    Directory.CreateDirectory(path);
                }
                catch (Exception)
                {
                    /*TODO: You must process this exception.*/
                    result = false;
                }
            }
            return result;
        }

        private Image ModifyImage(int x, int y, int w, int h, byte[] WorkingImage)
        {
            Resize resize = new Resize();
            Image returnImage;

            Image img = resize.ByteArrayToImage(WorkingImage);

            using (System.Drawing.Bitmap _bitmap = new System.Drawing.Bitmap(w, h))
            {
                _bitmap.SetResolution(img.HorizontalResolution, img.VerticalResolution);
                using (Graphics _graphic = Graphics.FromImage(_bitmap))
                {
                    _graphic.InterpolationMode = System.Drawing.Drawing2D.InterpolationMode.HighQualityBicubic;
                    _graphic.SmoothingMode = System.Drawing.Drawing2D.SmoothingMode.HighQuality;
                    _graphic.PixelOffsetMode = System.Drawing.Drawing2D.PixelOffsetMode.HighQuality;
                    _graphic.CompositingQuality = System.Drawing.Drawing2D.CompositingQuality.HighQuality;


                    _graphic.DrawImage(img, 0, 0, img.Width, img.Height);
                    _graphic.DrawImage(img, new Rectangle(0, 0, W_FixedSize, H_FixedSize), 0, 0, img.Width, img.Height, GraphicsUnit.Pixel);

                    string extension = ".jpg";

                    // If the image is a gif file, change it into png
                    if (extension.EndsWith("gif", StringComparison.OrdinalIgnoreCase))
                    {
                        extension = ".png";
                    }

                    using (EncoderParameters encoderParameters = new EncoderParameters(1))
                    {
                        encoderParameters.Param[0] = new EncoderParameter(Encoder.Quality, 100L);

                        MemoryStream ms = new MemoryStream(resize.ImageToByteArray(_bitmap, extension, encoderParameters));
                        returnImage = Image.FromStream(ms);
                    }
                }
            }

            return returnImage;
        }
    }
}
