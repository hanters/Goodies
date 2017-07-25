using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Routing;

namespace Web.Frooty
{
    public class RouteConfig
    {
        public static void RegisterRoutes(RouteCollection routes)
        {
            routes.IgnoreRoute("{resource}.axd/{*pathInfo}");

            routes.MapRoute(
                name: "Success",
                url: "Success",
                defaults: new { controller = "Payment", action = "Index", id = UrlParameter.Optional }
            );

            routes.MapRoute(
                name: "New",
                url: "New/{id}",
                defaults: new { controller = "News", action = "Page", id = UrlParameter.Optional }
            );


            routes.MapRoute(
                name: "Recipe",
                url: "Recipe/{id}",
                defaults: new { controller = "Recipes", action = "Page", id = UrlParameter.Optional }
            );


            routes.MapRoute(
                name: "Events",
                url: "Events",
                defaults: new { controller = "Events", action = "Events", id = UrlParameter.Optional }
            );


            routes.MapRoute(
                name: "Event",
                url: "Event/{id}",
                defaults: new { controller = "Events", action = "Page", id = UrlParameter.Optional }
            );

            routes.MapRoute(
                name: "Default",
                url: "{controller}/{action}/{id}",
                defaults: new { controller = "Default", action = "Index", id = UrlParameter.Optional }
            );
        }
    }
}