using System.Web.Mvc;
using System.Web.Routing;

namespace Web.Frooty.Admin
{
    public class RouteConfig
    {
        public static void RegisterRoutes(RouteCollection routes)
        {
            routes.IgnoreRoute("{resource}.axd/{*pathInfo}");

            routes.MapRoute(
               name: "About",
               url: "About",
               defaults: new { controller = "About", action = "Index", id = UrlParameter.Optional }
           );


            routes.MapRoute(
                name: "Shipping",
                url: "Shipping",
                defaults: new { controller = "Shipping", action = "Index", id = UrlParameter.Optional }
            );

            routes.MapRoute(
                name: "rules-products",
                url: "rules-products",
                defaults: new { controller = "rules", action = "Index", id = UrlParameter.Optional }
            );

            routes.MapRoute(
                name: "DashBoard",
                url: "DashBoard",
                defaults: new { controller = "Default", action = "Index", id = UrlParameter.Optional }
            );

            routes.MapRoute(
                name: "Default",
                url: "{controller}/{action}/{id}",
                defaults: new { controller = "Login", action = "Index", id = UrlParameter.Optional }
            );
        }
    }
}