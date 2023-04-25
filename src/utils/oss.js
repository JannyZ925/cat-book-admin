import OSS from "ali-oss";
import { nanoid } from "nanoid";

// 阿里云对象存储配置
const client = new OSS({
  region: "oss-cn-hangzhou",
  accessKeyId: "LTAI5tBHstTUnkARRzy7rTwE",
  accessKeySecret: "ofAVUjCFJF3IR4iJtkpDlx3X4CfGAR",
  bucket: "cat-book-ccsu",
});

async function putObject(data) {
  // 获取图片后缀
  let suffix = data.name.split(".")[1];
  // 生成图片名称
  let name = nanoid() + "." + suffix;
  try {
    // 将图片上传到阿里云
    const result = await client.put(`cat-img/${name}`, data);
    return result.url;
  } catch (e) {
    console.log(e);
  }
}

export default putObject;
