const body=document.body;
const main=document.getElementById('main');

let Container;
const API_KEY='&api_key=2f19701f268790d70c5ce6fb6e2201e4';
const YOUTUBE_API_KEY="AIzaSyD3ebt51vV96BrDF7AwPpHz93dCGfwa2B8";

const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIyZjE5NzAxZjI2ODc5MGQ3MGM1Y2U2ZmI2ZTIyMDFlNCIsIm5iZiI6MTcyMDgyNzM1Ny40MzMxNTcsInN1YiI6IjY2OGVjYjQyOTM0NThiM2Q2MTM5YzY0YiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.I4r-fqY2d9EeFSw8qq1Iu69DHxEOca1gNqSnzADtA1U'
    }
};

let Search_Box=document.getElementById("searchbox");
Search_Box.addEventListener("keypress", function(event) {
    if(event.key){
        while (body.querySelector("#containerlist")){
            body.querySelector("#containerlist").remove();
        }
        if(document.getElementById("searchbox").value!=''){
            document.getElementById("main").classList.replace("center","top");
        }else{
            document.getElementById("main").classList.replace("top","center");
        }
        let img;
        let Search_Query="https://api.themoviedb.org/3/search/movie?query="+replacespace(Search_Box.value);
        fetch(Search_Query,options)
            .then(R1 => R1.json())
            .then(R1 => {
                R1.results.forEach(item => {
                    Container = document.createElement("div");
                    Container.setAttribute("id","containerlist")

                    Cover = document.createElement("div");
                    img = document.createElement("img");
                    img.setAttribute("src","https://image.tmdb.org/t/p/original/"+item.poster_path)
                    img.classList.add("poster");
                    if(body.classList.contains("dark")){
                        img.classList.add("dark");
                    }else{
                        img.classList.add("light");
                    }
                    

                    Cover.append(img);
                    Cover.setAttribute("id",item.id);
                    Cover.setAttribute("onclick","trailer(this)");
                    Container.prepend(Cover);
                    main.append(Container);
                });
            })
        }
})

let trailer=(element) => {
    
    let page=window.open("");
    newpage(page);
    if (main.classList.contains("dark")){
        page.document.body.classList.add("dark");

    }else{
        page.document.body.classList.add("light");
    }


    let InternalID = element.id;
    fetch("https://api.themoviedb.org/3/movie/"+InternalID+"/external_ids",options)
        .then(R2 => R2.json())
        .then(R2 => {
            let ExternalID = R2.imdb_id;
            fetch("https://api.themoviedb.org/3/find/"+ExternalID+"?external_source=imdb_id",options)
                .then(R3 => R3.json())
                .then(R3 => {
                    let Title = R3.movie_results[0].original_title
                    let Year = R3.movie_results[0].release_date.substring(0,4);
                    let Tab=document.createElement("div");
                    let Onglet = Object.assign(document.createElement("title"),{ textContent :Title} );
                    
                    Tab.setAttribute("id","main");
                    let switcher=document.createElement("span");
                    switcher.setAttribute("id","state");
                    switcher.setAttribute("onclick","toggle()");
                    switcher.classList.add("stateoff");
                    let btn = document.createElement("span");
                    btn.setAttribute("id","toggle");
                    btn.classList.add("toggleoff");
                    switcher.append(btn);
                    Tab.append(switcher);

                    let Header = Object.assign(document.createElement("h1"), { textContent: Title+' ('+Year+')', className: "title" });

                    page.document.getElementsByTagName('HEAD')[0].appendChild(Onglet);
                    Tab.append(Header);
                    
                                        
                    Youtube_Query = "https://www.googleapis.com/youtube/v3/search?part=snippet&q= "+Title+" "+Year+" Official Trailer "+"&key="+YOUTUBE_API_KEY+"&type=video";
                    fetch(Youtube_Query)
                        .then(R4=>R4.json())
                        .then(R4 => {

                            let videoContainer = document.createElement("div");
                            videoContainer.setAttribute("id", "videoContainer");

                            const videoId = R4.items[0].id.videoId;
                            const embedUrl = "https://www.youtube.com/embed/" + videoId;

                            videoContainer.innerHTML = `</br><iframe width='600' height='300' src="${embedUrl}" frameborder='0' allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture' allowfullscreen></iframe>`;
                            Tab.append(videoContainer);
                            page.document.body.append(Tab);

                            page.window.toggle = function () {
                                if (page.document.body.classList.contains("light")) {
                                    page.document.body.classList.replace("light", "dark");
                                    page.document.getElementById("toggle").classList.replace('toggleoff', 'toggleon');
                                    page.document.getElementById("state").classList.replace('stateoff', 'stateon');
                                } else {
                                    page.document.body.classList.replace("dark", "light");
                                    page.document.getElementById("toggle").classList.replace('toggleon', 'toggleoff');
                                    page.document.getElementById("state").classList.replace('stateon', 'stateoff');
                                }
                            };
                        });


                });
            });

}; 



let newpage = (p)=>{
    let link = document.createElement("link");
    link.rel="stylesheet";
    link.type="text/css";
    link.href="styles.css";
    p.document.getElementsByTagName('head')[0].appendChild(link);
}
let toggle = ()=>{
    if (body.classList.contains("light")){
        body.classList.replace("light","dark");
        document.getElementById("toggle").classList.replace('toggleoff','toggleon');
        document.getElementById("state").classList.replace('stateoff','stateon');
    }else{
        body.classList.replace("dark","light");
        document.getElementById("toggle").classList.replace('toggleon','toggleoff');
        document.getElementById("state").classList.replace('stateon','stateoff');
    }
}

let clear = () => {
    document.getElementById("searchbox").value='';
}
let replacespace = (str) => {
    return str.split(' ').join('+');
}