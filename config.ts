// 应用程序配置文件

// 应用程序配置数组 - 支持多主题选择
export const appConfigs = [
  {
    id: "revelation",
    names: {
      zh: "启示路",
      en: "revelation",
    },
    music: {
      audio_name: "Amazing Grace",
      artists: [{ name: "邓紫棋" }],
    },
    data: "extraction_results_data.json",
    defaultType: "novel",
    usePackageData: true,
    timeline: {
      novel: {
        name: {
          zh: "小说时间线",
          en: "Novel Timeline",
        },
        audioUrl:
          "https://p.scdn.co/mp3-preview/775fb3a76182997499309b0868a003528391da8e",
      },
      gem: {
        name: {
          zh: "邓紫棋时间线",
          en: "G.E.M. Timeline",
        },
        audioUrl: "All About You-G.E.M.邓紫棋.mp3",
      },
    },
  },
  {
    id: "buddha",
    names: {
      zh: "佛陀、苏格拉底、孔子、耶稣",
      en: "buddha-socrates-confucius-jesus",
    },
    music: {
      audio_name: "Amazing Grace",
      artists: [{ name: "邓紫棋" }],
    },
  },
  {
    id: "man-from-earth",
    names: {
      zh: "这个男人来自地球",
      en: "the-man-from-earth",
    },
    music: {
      audio_name: "Goldberg Variations",
      artists: [{ name: "Johann Sebastian Bach" }],
    },
    data: "THE.MAN.FROM.EARTH_data.json",
    timeline: "THE.MAN.FROM.EARTH_timeline.json",
  },
];
const sourceImage = "/cover.jpeg";

// 默认配置索引
export const DEFAULT_CONFIG_INDEX = 0;

// 导出当前配置（可通过应用内选择切换）
export const getCurrentConfig = () => {
  const savedIndex = localStorage.getItem("selectedConfigIndex");
  const index = savedIndex ? parseInt(savedIndex) : DEFAULT_CONFIG_INDEX;
  return appConfigs[index] || appConfigs[DEFAULT_CONFIG_INDEX];
};

const currentConfig = getCurrentConfig();
// 获取当前应用名称
export const appNames = currentConfig.names;

// 获取当前音乐配置
export const music_config = currentConfig.music;

// 获取当前源图片路径
export const SOURCE_IMAGE_PATH = sourceImage;
// 图标配置 - 基于单一源图片自动引用
export const appIcons = {
  // Android 图标配置
  android: {
    default: SOURCE_IMAGE_PATH,
  },
  // Web 应用图标
  web: {
    favicon: SOURCE_IMAGE_PATH,
    appleTouchIcon: SOURCE_IMAGE_PATH,
  },
};

// 应用图片配置 - 基于单一源图片自动引用
export const appImages = {
  // 主应用图片
  logo: {
    // 主要应用logo
    main: SOURCE_IMAGE_PATH,
    // 方形logo
    square: SOURCE_IMAGE_PATH,
    // 小尺寸logo
    small: SOURCE_IMAGE_PATH,
  },
  // 二维码图片
  qrcode: "/assets/qrcode.jpeg",
  // 背景图片
  background: {
    // 主背景
    main: null,
    // 次要背景
    secondary: null,
  },
  // 内容相关图片
  content: {
    // 默认封面图
    defaultCover: SOURCE_IMAGE_PATH,
    // 默认缩略图
    defaultThumbnail: SOURCE_IMAGE_PATH,
  },
};

// 图片自动生成配置 - 使用单一源图片路径
export const imageGenerationConfig = {
  // 源图片配置
  sourceImage: {
    // 主源图片路径 - 使用统一配置
    path: SOURCE_IMAGE_PATH,
    // 建议的源图片最小尺寸
    minSize: 512,
  },
  // 生成配置
  generation: {
    // 是否启用自动生成
    enabled: true,
    // 生成的图片格式
    format: "png",
    // 输出目录 - 现在直接输出到Android mipmap目录，此配置在脚本中已被覆盖
    outputDir: "/android/app/src/main/res",
    // 图片质量 (0-1，仅对有损格式有效)
    quality: 1.0,
    // 是否保持纵横比
    preserveAspectRatio: true,
    // 背景色 (当调整大小时需要填充时使用)
    backgroundColor: "#FFFFFF",
    // 生成脚本路径
    scriptPath: "./scripts/generate_images.js",
  },
};

// 版本信息配置
export const versionInfo = {
  zh: "",
  en: "",
};

// 定义章节页面项目的接口
export interface ChapterPageItem {
  firstPassTime: string;
  isChapterLock: boolean;
  isPaidPublication: boolean;
  isPaidStory: boolean;
  itemId: string;
  needPay: number;
  realChapterOrder: string;
  title: string;
  volume_name: string;
}

// 定义章节页面数据类型
export type ChapterPageData = ChapterPageItem[];

// 初始化chapterPage为一个空数组
let chapterPage: ChapterPageData = [];

if (typeof window !== "undefined" && window.fetch) {
  // 异步加载函数（不会阻塞模块导出）
  const loadChapterPageData = async () => {
    try {
      const localUrl = "/chapterPage.json";
      const localResponse = await fetch(localUrl);
      if (!localResponse.ok) {
        throw new Error(`HTTP error! status: ${localResponse.status}`);
      }
      chapterPage = await localResponse.json();
      console.log("Chapter page data loaded successfully from local JSON");
      return chapterPage;
    } catch (error) {
      console.error("Failed to load chapter page data:", error);
    }
  };

  // 启动异步加载
  loadChapterPageData();
} else if (
  typeof process !== "undefined" &&
  process.versions &&
  process.versions.node
) {
  // 在Node.js环境中，尝试同步加载文件
  try {
    const fs = require("fs");
    const path = require("path");
    const filePath = path.join(process.cwd(), "public", "chapterPage.json");
    if (fs.existsSync(filePath)) {
      const fileContent = fs.readFileSync(filePath, "utf-8");
      chapterPage = JSON.parse(fileContent);
      console.log(
        "Chapter page data loaded successfully from JSON in Node.js environment"
      );
    }
  } catch (error) {
    console.error("Failed to load chapterPage.json in Node.js:", error);
  }
}

// 时间线数据配置
export const timelineConfig = {
  defaultType: currentConfig.defaultType || "json",
  usePackageData: currentConfig.usePackageData,
  // 时间线数据源配置
  sources: {
    json: {
      name: appNames,
      jsonPath: currentConfig.timeline || "timeline.json",
      audioUrl: "bg.mp3",
      ...music_config,
    },
  },
  // 动画延迟时间（毫秒）
  animationDelay: 3000,
  // 音频默认音量
  audioVolume: 0.3,
};

export const config = {
  // 数据文件路径
  dataFilePath: currentConfig.data || "data.json",
  // 章节页面配置 - 指向JSON文件
  chapterPage,
  // 时间线配置
  timeline: timelineConfig,
  // 图标配置
  icons: appIcons,
  // 应用图片配置
  images: appImages,
  // 图片自动生成配置
  imageGeneration: imageGenerationConfig,
};

/**
 * 获取图片URL的辅助函数
 * @param imageType 图片类型 (logo, qrcode, background, content)
 * @param subType 图片子类型 (如果适用)
 * @param defaultUrl 默认URL，当指定图片不存在时使用
 * @returns 完整的图片URL
 */
export function getImageUrl(
  imageType: string,
  subType?: string,
  defaultUrl: string = SOURCE_IMAGE_PATH
): string {
  try {
    // 检查类型是否存在
    if (!appImages[imageType]) {
      console.warn(`图片类型 ${imageType} 不存在`);
      return defaultUrl;
    }

    // 如果有子类型且图片类型是对象
    if (
      subType &&
      typeof appImages[imageType] === "object" &&
      appImages[imageType] !== null
    ) {
      const subImage = appImages[imageType][subType];
      if (subImage) {
        return subImage;
      } else {
        console.warn(`图片子类型 ${imageType}.${subType} 不存在`);
        return defaultUrl;
      }
    }

    // 直接返回图片URL
    const imageUrl = appImages[imageType];
    return imageUrl || defaultUrl;
  } catch (error) {
    console.error("获取图片URL时发生错误:", error);
    return defaultUrl;
  }
}

// 直接导出chapterPage以供其他模块使用
export { chapterPage };
