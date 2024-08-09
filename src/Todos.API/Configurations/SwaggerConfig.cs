using Asp.Versioning.ApiExplorer;
using Microsoft.OpenApi.Models;

namespace Todos.API.Configurations;

public static class SwaggerConfig
{
    public static void AddSwaggerConfigured(this IServiceCollection services)
    {
        services.AddSwaggerGen(options =>
        {
            var provider = services.BuildServiceProvider().GetRequiredService<IApiVersionDescriptionProvider>();

            foreach (var description in provider.ApiVersionDescriptions)
            {
                options.SwaggerDoc(description.GroupName, new OpenApiInfo
                {
                    Title = $"Todos API {description.ApiVersion}",
                    Version = description.ApiVersion.ToString()
                });
            }
        });
    }
}