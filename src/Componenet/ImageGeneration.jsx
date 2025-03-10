import React, { useRef, useState } from "react";
import "./ImageGeneartion.css";
import image from "../Assests/default.webp";
import ReactTypingEffect from "react-typing-effect";
import {motion} from 'framer-motion'

const ImageGeneration = () => {
  const key = process.env.REACT_APP_API_KEY;

  const [image_url, setimage_url] = useState("/");
  const [imageblob, setimageblob] = useState(null);
  let inputRef = useRef(null);
  const [loading_active, set_loading] = useState(false);

  const generateImage = () => {
    set_loading(true);
    if (inputRef.current.value == "") {
      return;
    }
    query(inputRef.current.value).then((response) => {
      const objectURL = URL.createObjectURL(response);
      setimage_url(objectURL);
      setimageblob(response);
      set_loading(false);
    });
  };

  async function query(data) {
    const response = await fetch(
      "https://api-inference.huggingface.co/models/ZB-Tech/Text-to-Image",
      {
        headers: {
          Authorization: `Bearer ${key}`,
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify(data),
      }
    );
    const result = await response.blob();
    return result;
  }

  const downloadBtn = () => {
    if (image_url !== "/") {
      const link = document.createElement("a");
      const objectURL = URL.createObjectURL(imageblob);
      link.href = objectURL;
      link.download = "generate_image.png";
      link.click();
      URL.revokeObjectURL(objectURL);
    } else {
      alert("No image to download!");
    }
  };

  return (
    <div className="image_generation">
      <div className="container">
        <div className="heading">
          <h2>
            AI Image{" "}
            <span>
              <ReactTypingEffect
                text={["Generator"]}
                speed={100}
                eraseSpeed={50}
                eraseDelay={1000}
                typingDelay={500}
                cursor="|"
              />
            </span>
          </h2>
        </div>

        <motion.div className="image_section"
            initial={{opacity:0.2,y:50}}
            animate={{opacity:1,y:0}}
            transition={{delay:0.2,duration:0.8}}
        >
          <img
            src={image_url === "/" ? image : image_url}
            alt="default image"
          />
        </motion.div>

        <div className={loading_active ? "loading_section" : "loading_none"}>
          <div className="loading_bar"></div>
          <p>Loading...</p>
        </div>

        <motion.div className="search_box"
        initial={{opacity:0.2,y:50}}
        animate={{opacity:1,y:0}}
        transition={{delay:0.4,duration:0.8}}
        >
          <input
            type="text"
            ref={inputRef}
            name="input_box"
            id="input_box"
            placeholder="Describe the description of Image..."
          />
          {/* <button
            onClick={() => {
              generateImage();
            }}
          >
            Generate
          </button> */}
          <button
            onClick={() => {
              generateImage();
            }}
            type="button"
            className="px-8 py-3 font-semibold rounded-full dark:bg-gray-800 dark:text-gray-100"
            fdprocessedid="rnvuzd"
          >
            Generate
          </button>
        </motion.div>

        <motion.div className="reset_and_download_button"
           initial={{opacity:0.2,y:50}}
           animate={{opacity:1,y:0}}
           transition={{delay:0.6,duration:0.8}}
        >
          <button
            onClick={() => {
              setimage_url("/");
              inputRef.current.value = "";
            }}
          >
            Reset
          </button>
          {/* <button onClick={()=>{downloadBtn()}}>Download</button> */}
          <div
            className="button"
            data-tooltip="Click Here"
            onClick={() => {
              downloadBtn();
            }}
          >
            <div className="button-wrapper">
              <div className="text">Download</div>
              <span className="icon">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                  role="img"
                  width="2em"
                  height="2em"
                  preserveAspectRatio="xMidYMid meet"
                  viewBox="0 0 24 24"
                >
                  <path
                    fill="none"
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 15V3m0 12l-4-4m4 4l4-4M2 17l.621 2.485A2 2 0 0 0 4.561 21h14.878a2 2 0 0 0 1.94-1.515L22 17"
                  ></path>
                </svg>
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ImageGeneration;
