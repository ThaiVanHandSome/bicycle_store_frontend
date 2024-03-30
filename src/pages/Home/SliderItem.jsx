import classNames from "classnames/bind";
import styles from "./Home.module.scss";
import { useEffect, useMemo, useState } from "react";
import { Progress } from "@nextui-org/react";
import ButtonCustom from "~/components/ButtonCustom";
const cx = classNames.bind(styles);

function SliderItem({ item, time }) {
  const [monaCapAnimation, setMonaCapAnimation] = useState("");
  const [bicyclesCapAnimation, setBicyclesCapAnimation] = useState("");
  const [imageAnimation, setImageAnimation] = useState("");
  const [titleAnimation, setTitleAnimation] = useState("");
  const [subTitleAnimation, setSubTitleAnimation] = useState("");
  const [desc1Animation, setDesc1Animation] = useState("");
  const [desc2Animation, setDesc2Animation] = useState("");
  const [btnAnimation, setBtnAnimation] = useState("");
  const [isReady, setIsReady] = useState(null);
  const [animationImageTrigger, setAnimationImageTrigger] = useState(false);
  const [animationTitleTrigger, setAnimationTitleTrigger] = useState(false);
  const [animationSubTitleTrigger, setAnimationSubTitleTrigger] =
    useState(false);
  const [animationDesc1Trigger, setAnimationDesc1Trigger] = useState(false);
  const [animationDesc2Trigger, setAnimationDesc2Trigger] = useState(false);
  const [animationBtnTrigger, setAnimationBtnTrigger] = useState(false);
  const [capTrigger, setCapTrigger] = useState(false);

  const [progressVal, setProgressVal] = useState(0);
  const timeInterval = 400;

  const handleSetClass = () => {
    setCapTrigger(true);
    setTimeout(() => {
      setAnimationImageTrigger(true);
    }, 650);
    setTimeout(() => {
      setAnimationSubTitleTrigger(true);
    }, 1050);
    setTimeout(() => {
      setAnimationTitleTrigger(true);
    }, 1350);
    setTimeout(() => {
      setAnimationDesc1Trigger(true);
    }, 1650);
    setTimeout(() => {
      setAnimationDesc2Trigger(true);
    }, 1950);
    setTimeout(() => {
      setAnimationBtnTrigger(true);
    }, 2250);
    setMonaCapAnimation("captionMONA-appear");
    setBicyclesCapAnimation("captionBICYCLES-appear");
    setImageAnimation("image-appear");
    setTitleAnimation("title-appear");
    setSubTitleAnimation("subtitle-appear");
    setDesc1Animation("desc1-appear");
    setDesc2Animation("desc2-appear");
    setBtnAnimation("btn-appear");
    const timer = setTimeout(() => {
      setImageAnimation("");
      setMonaCapAnimation("");
      setBicyclesCapAnimation("");
    }, 1000);
    const timer2 = setTimeout(() => {
      setSubTitleAnimation("");
    }, 1600);
    const timer3 = setTimeout(() => {
      setTitleAnimation("");
    }, 2300);
    const timer4 = setTimeout(() => {
      setDesc1Animation("");
    }, 3000);
    const timer5 = setTimeout(() => {
      setDesc2Animation("");
    }, 3800);
    const timer8 = setTimeout(() => {
      setBtnAnimation("");
    }, 4600);
  };

  useEffect(() => {
    const timer6 = setTimeout(() => {
      setIsReady(false);
      handleSetClass();
    }, 0);

    const idInterval = setInterval(() => {
      setProgressVal(
        (prev) => prev + (timeInterval * 100) / (time - timeInterval),
      );
    }, timeInterval);
    return () => {
      clearInterval(idInterval);
      setIsReady(null);
      setAnimationImageTrigger(false);
      setAnimationTitleTrigger(false);
      setAnimationSubTitleTrigger(false);
      setAnimationDesc1Trigger(false);
      setAnimationDesc2Trigger(false);
      setCapTrigger(false);
      setAnimationBtnTrigger(false);
      setProgressVal(0);
    };
  }, [item]);

  return (
    <div className="flex h-full flex-col xl:flex-row xl:pt-12">
      <Progress
        aria-label="progress"
        size="sm"
        value={progressVal}
        className="absolute left-0 top-0 w-full transition-none"
      />

      <p
        className={cx(
          monaCapAnimation,
          "absolute left-[70%] top-[20%] hidden -translate-x-1/2 -translate-y-1/2 text-9xl font-bold text-pri opacity-10 xl:block",
          {
            "left-[80%]": !capTrigger,
            "opacity-0": !capTrigger,
          },
        )}
      >
        {item.cap_1}
      </p>

      <p
        className={cx(
          bicyclesCapAnimation,
          "absolute left-[20%] top-[75%] hidden -translate-y-1/2 text-9xl font-bold text-pri opacity-10 xl:block",
          {
            "left-[10%]": !capTrigger,
            "opacity-0": !capTrigger,
          },
        )}
      >
        {item.cap_2}
      </p>

      <div className="h-full w-full xl:w-1/2 xl:pe-4 xl:ps-16 xl:pt-2">
        <p
          className={cx(
            subTitleAnimation,
            "mb-4 hidden text-medium font-bold xl:block",
            {
              "translate-y-[-32px]": !animationSubTitleTrigger,
              "opacity-0": !animationSubTitleTrigger,
            },
          )}
        >
          {item.sub_title}
        </p>
        <h1
          className={cx(
            titleAnimation,
            "mb-3 text-center text-6xl font-bold leading-tight text-pri xl:text-left",
            {
              "translate-y-[-32px]": !animationTitleTrigger,
              "opacity-0": !animationTitleTrigger,
            },
          )}
        >
          {item.title}
        </h1>
        <p
          className={cx(
            desc1Animation,
            "mb-2 text-justify text-medium font-semibold italic leading-8",
            {
              "translate-y-[-32px]": !animationDesc1Trigger,
              "opacity-0": !animationDesc1Trigger,
            },
          )}
        >
          {item.desc_1}
        </p>
        <p
          className={cx(
            desc2Animation,
            "mb-3 hidden text-justify text-medium font-semibold italic leading-8 xl:block xl:w-3/4",
            {
              "translate-y-[-32px]": !animationDesc2Trigger,
              "opacity-0": !animationDesc2Trigger,
            },
          )}
        >
          {item.desc_2}
        </p>
        <ButtonCustom
          radius="md"
          size="lg"
          className={cx("hidden xl:block", {
            "translate-y-[-32px]": !animationBtnTrigger,
            "opacity-0": !animationBtnTrigger,
          })}
        >
          Mua Ngay
        </ButtonCustom>
      </div>
      <div className="flex h-full flex-grow items-center justify-center">
        <img
          alt="bicycle-slider"
          style={{
            "max-width": "100%",
          }}
          className={cx(imageAnimation, {
            "translate-y-[-32px]": !animationImageTrigger,
            "opacity-0": !animationImageTrigger,
          })}
          src={item.url}
        />
      </div>
    </div>
  );
}

export default SliderItem;
