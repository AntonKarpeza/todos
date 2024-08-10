using AutoMapper;
using Todos.API.Models;
using Todos.Application.Queries;
using Todos.Domain.Entities;
using Todos.Domain.Helpers;

namespace Todos.API.Mapping;

public class MappingProfile : Profile
{
    public MappingProfile()
    {
        CreateMap<FilterTodoTasksViewModel, GetTodoTasksQuery>();
        CreateMap<TodoTask, TodoTaskViewModel>().ReverseMap();

        CreateMap<PaginatedList<TodoTask>, PaginatedListViewModel<TodoTaskViewModel>>()
            .ForMember(dest => dest.Items, opt => opt.MapFrom(src => src.Items))
            .ForMember(dest => dest.PageIndex, opt => opt.MapFrom(src => src.PageIndex))
            .ForMember(dest => dest.TotalPages, opt => opt.MapFrom(src => src.TotalPages))
            .ForMember(dest => dest.TotalCount, opt => opt.MapFrom(src => src.TotalCount));
    }
}