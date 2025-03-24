import Image from "next/image";
import Single_image from "./single_image_view/page";
import Add_image from "./siangle_image_add/page";
import Multiple_image_view from "./multiple_image_view/page";
import Multiple_image_add from "./multiple_image_add/page";

export default function Home() {
  return (
    <>
      <h1>home</h1>
      <div className="grid lg:grid-cols-[70%_auto] grid-cols-[50%_auto] gap-[10px] bg-amber-300">
        <Single_image />
        <Add_image />
      </div>
      <div className="grid lg:grid-cols-[70%_auto] grid-cols-[50%_auto] gap-[10px] bg-blue-400">
        <Multiple_image_view />
        <Multiple_image_add />
      </div>

    </>
  );
}
