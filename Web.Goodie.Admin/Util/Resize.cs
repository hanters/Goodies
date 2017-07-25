using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.IO;
using System.Drawing;
using System.Drawing.Imaging;

namespace Web.Frooty.Admin.Util
{
    public class Resize
    {
        public Image ByteArrayToImage(byte[] byteArrayIn)
        {
            MemoryStream ms = new MemoryStream(byteArrayIn);
            Image returnImage = Image.FromStream(ms);
            ms.Dispose();
            ms = null;
            return returnImage;
        }

        public byte[] ImageToByteArray(System.Drawing.Image image, string extension, EncoderParameters encoderParameters)
        {
            MemoryStream ms = new MemoryStream();
            if (!string.IsNullOrEmpty(extension) && encoderParameters != null)
                image.Save(ms, GetImageCodec(extension), encoderParameters);
            else
                image.Save(ms, image.RawFormat);
            return ms.ToArray();
        }

        public static ImageCodecInfo GetImageCodec(string extension)
        {
            extension = extension.ToUpperInvariant();
            ImageCodecInfo[] codecs = ImageCodecInfo.GetImageEncoders();
            foreach (ImageCodecInfo codec in codecs)
            {
                if (codec.FilenameExtension.Contains(extension))
                {
                    return codec;
                }
            }
            return codecs[1];
        }

        public byte[] ImageToByteArray(System.Drawing.Image image)
        {
            return ImageToByteArray(image, null, null);
        }
    }
}