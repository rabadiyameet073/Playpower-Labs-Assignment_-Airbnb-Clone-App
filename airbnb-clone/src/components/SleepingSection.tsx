import React, { memo } from "react";
import bedroomImg from "../assets/image1_files/67c61c6f-6260-4809-9510-0360e58a345d.jpeg";
import livingRoomImg from "../assets/image1_files/a9831aeb-f441-44f5-a38f-4cf54e3f0fcf.jpeg";

interface BedroomCard {
  name: string;
  beds: string;
  image: string;
}

const BEDROOMS: BedroomCard[] = [
  { name: "Bedroom", beds: "1 double bed", image: bedroomImg },
  { name: "Living room", beds: "1 sofa", image: livingRoomImg },
];

const SleepingSection = memo(function SleepingSection() {
  return (
    <div className="_DETeJn">
      <h2 className="_ALTsyF">Where you'll sleep</h2>
      <div className="_oTNrXm">
        {BEDROOMS.map((bedroom) => (
          <div key={bedroom.name} className="_fbRSJo">
            <div className="sleeping-img-wrapper">
              <img
                src={bedroom.image}
                alt=""
                className="select-none"
              />
            </div>
            <div className="_advEXQ">{bedroom.name}</div>
            <div className="_oKYmRd">{bedroom.beds}</div>
          </div>
        ))}
      </div>
    </div>
  );
});

export default SleepingSection;
