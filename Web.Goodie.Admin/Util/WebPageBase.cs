using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Web;
using System.Web.Mvc;
using System.Web.Routing;
using System.Web.Security;



namespace Web.Frooty.Admin.Util
{
    public abstract class WebPageBase : System.Web.Mvc.Controller
    {
        #region Construtor

        public WebPageBase()
        {
        }

        #endregion

        #region Eventos

        protected override void Initialize(System.Web.Routing.RequestContext requestContext)
        {
            requestContext.HttpContext.Response.Buffer = true;
            requestContext.HttpContext.Response.ExpiresAbsolute = DateTime.Now.AddDays(-1);
            requestContext.HttpContext.Response.Expires = 0;
            requestContext.HttpContext.Response.CacheControl = "no-cache";
            string strPaginaAtual = requestContext.HttpContext.Request.CurrentExecutionFilePath;
            strPaginaAtual = strPaginaAtual.Remove(0, strPaginaAtual.LastIndexOf("/") + 1);


            if (SessaoUtil.sessaoPerdida())
            {
                requestContext.HttpContext.Session["acabou"] = "Sua sessão foi perdida!";
                requestContext.HttpContext.Response.Redirect("~/Login/index");
            }

            base.Initialize(requestContext);

        }

        protected override void OnException(ExceptionContext filterContext)
        {
            // Do additional things like logging here.
            base.OnException(filterContext);
        }

        #endregion

    }
}
