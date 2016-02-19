!function(e){function t(){var e=a(),t=u[e];return t||(t=u[e]={query:{SortBy:"SortName",SortOrder:"Ascending",Fields:"DateCreated,PrimaryImageAspectRatio,MediaSourceCount,SyncInfo",ImageTypeLimit:1,EnableImageTypes:"Primary,Backdrop,Banner,Thumb",StartIndex:0,Limit:LibraryBrowser.getDefaultPageSize()}},t.query.Filters="",t.query.NameStartsWithOrGreater="",t.view=LibraryBrowser.getSavedView(e)||LibraryBrowser.getDefaultItemsView("Poster","Poster"),t.query.ParentId=getParameterByName("parentId"),LibraryBrowser.loadSavedQueryValues(e,t.query)),t}function r(){return t().query}function a(){return LibraryBrowser.getSavedQueryKey()}function i(s){Dashboard.showLoadingMsg();var u=r(),m=Dashboard.getCurrentUserId(),d=u.ParentId?ApiClient.getItem(m,u.ParentId):ApiClient.getRootFolder(m),c=ApiClient.getItems(m,u);Promise.all([d,c]).then(function(r){var m=r[0];l=m;var d=r[1];window.scrollTo(0,0);var c=t().view,y="",g=LibraryBrowser.getQueryPagingHtml({startIndex:u.StartIndex,limit:u.Limit,totalRecordCount:d.TotalRecordCount,showLimit:!1,addLayoutButton:!0,currentLayout:c,sortButton:!0,layouts:"Poster,PosterCard,Thumb",filterButton:!0});s.querySelector(".listTopPaging").innerHTML=g,o(s);var b=getParameterByName("context"),p={items:d.Items,shape:"auto",centerText:!0,lazy:!0,coverImage:"PhotoAlbum"==m.Type};"Backdrop"==c?(p.shape="backdrop",p.showTitle=!0,p.preferBackdrop=!0,y=LibraryBrowser.getPosterViewHtml(p)):"Poster"==c?(p.showTitle="photos"==b?"auto":!0,p.overlayText="photos"==b,y=LibraryBrowser.getPosterViewHtml(p)):"PosterCard"==c?(p.showTitle=!0,p.showYear=!0,p.cardLayout=!0,p.centerText=!1,y=LibraryBrowser.getPosterViewHtml(p)):"Thumb"==c&&(p.preferThumb=!0,p.shape="backdrop",y=LibraryBrowser.getPosterViewHtml(p));var h=s.querySelector("#items");h.innerHTML=y+g,ImageLoader.lazyChildren(h),e(".btnFilter",s).on("click",function(){n(s)}),e(".btnNextPage",s).on("click",function(){u.StartIndex+=u.Limit,i(s)}),e(".btnPreviousPage",s).on("click",function(){u.StartIndex-=u.Limit,i(s)}),e(".btnChangeLayout",s).on("layoutchange",function(e,r){t().view=r,LibraryBrowser.saveViewSetting(a(),r),i(s)}),e(".btnSort",s).on("click",function(){LibraryBrowser.showSortMenu({items:[{name:Globalize.translate("OptionNameSort"),id:"SortName"},{name:Globalize.translate("OptionCommunityRating"),id:"CommunityRating,SortName"},{name:Globalize.translate("OptionCriticRating"),id:"CriticRating,SortName"},{name:Globalize.translate("OptionDateAdded"),id:"DateCreated,SortName"},{name:Globalize.translate("OptionDatePlayed"),id:"DatePlayed,SortName"},{name:Globalize.translate("OptionParentalRating"),id:"OfficialRating,SortName"},{name:Globalize.translate("OptionPlayCount"),id:"PlayCount,SortName"},{name:Globalize.translate("OptionReleaseDate"),id:"PremiereDate,SortName"},{name:Globalize.translate("OptionRuntime"),id:"Runtime,SortName"}],callback:function(){i(s)},query:u})}),LibraryBrowser.saveQueryValues(getParameterByName("parentId"),u);var P=m.Name;null!=m.IndexNumber&&(P=m.IndexNumber+" - "+P),null!=m.ParentIndexNumber&&(P=m.ParentIndexNumber+"."+P),LibraryMenu.setTitle(P),s.dispatchEvent(new CustomEvent("displayingitem",{detail:{item:m},bubbles:!0})),LibraryBrowser.setLastRefreshed(s),Dashboard.hideLoadingMsg()})}function n(e){require(["components/filterdialog/filterdialog"],function(t){var a=new t({query:r()});Events.on(a,"filterchange",function(){i(e)}),a.show()})}function o(t){var a=r();e(".alphabetPicker",t).alphaValue(a.NameStartsWithOrGreater)}function s(){var t=r(),a=e(this).parents(".page"),i=LibraryBrowser.getListItemInfo(this);return"Photo"==i.mediaType?(require(["scripts/photos"],function(){Photos.startSlideshow(a,t,i.id)}),!1):void 0}var l,u={};pageIdOn("pageinit","itemListPage",function(){var t=this;e(".alphabetPicker",this).on("alphaselect",function(e,a){var n=r();n.NameStartsWithOrGreater=a,n.StartIndex=0,i(t)}).on("alphaclear",function(){var e=r();e.NameStartsWithOrGreater="",i(t)}),e(t).on("click",".mediaItem",s)}),pageIdOn("pagebeforeshow","itemListPage",function(){var e=this;i(e),o(e),LibraryMenu.setBackButtonVisible(getParameterByName("context"))}),pageIdOn("pagebeforehide","itemListPage",function(){l=null})}(jQuery,document);