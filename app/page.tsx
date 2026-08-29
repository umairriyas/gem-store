import Hero from "./components/hero";
import Newest from "./components/newest";
import Banner from "./components/banner";
import Footer from "./components/footer";

// Location entity: homepage only. Every field below must be verifiable
// against something shown on the site or confirmed by the client.
const businessSchema = {
  "@context": "https://schema.org",
  "@type": "JewelryStore",
  "@id": "https://riyasgems.com/#business",
  name: "Riyas Gems",
  url: "https://riyasgems.com",
  image: "https://riyasgems.com/logo.png",
  telephone: "+94775621554",
  email: "info@riyasgems.com",
  parentOrganization: { "@id": "https://riyasgems.com/#organization" },
  address: {
    "@type": "PostalAddress",
    // CONFIRM with client. "Main Street, Gintota" appears nowhere on the site.
    // streetAddress: "",
    addressLocality: "Gintota, Galle",
    addressRegion: "Southern Province",
    // CONFIRM. 80000 is Galle city; Gintota is usually 80300.
    // postalCode: "",
    addressCountry: "LK",
  },
  // CONFIRM coordinates against the actual shopfront before restoring.
  // geo: { "@type": "GeoCoordinates", latitude: 0, longitude: 0 },
  //
  // CONFIRM trading hours with the client before restoring.
  // openingHoursSpecification: [...],
  //
  // CONFIRM the profiles exist before restoring.
  // sameAs: [],
};

export default function Home() {
  return (
    <div className="bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(businessSchema).replace(/</g, "\\u003c"),
        }}
      />
      <Hero />
      <Newest />
      <Banner />
      <Footer />
    </div>
  );
}
