import  ImageUrlBuilder  from "@sanity/image-url";
import { createClient } from "next-sanity"




export const client = createClient({
    projectId: "4o80zeix",
    dataset:"production",
    apiVersion:"2025-09-14",
    useCdn:true,

});


const builder = ImageUrlBuilder(client);

export function urlFor(source:any) {
    return builder.image(source);
}