import Header from "./components/Header";
import Footer from "./components/Footer";
import VideoSplit from "./components/VideoSplit";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-(--clivo-bg)">
      <Header />

      {/* Main content */}
      <main className="flex-1 px-5 pt-16 pb-8">
        <VideoSplit />
      </main>

      {/* Footer wrapper */}
      <div className="w-full mx-auto px-5">
        <Footer />
      </div>
    </div>
  );
}
