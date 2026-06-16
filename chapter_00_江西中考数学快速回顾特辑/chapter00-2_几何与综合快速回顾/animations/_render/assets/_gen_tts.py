"""
批量生成 晓秋(zh-CN-XiaoqiuNeural) TTS 配音 + 测量 mp3 时长。
第零章：几何与综合快速回顾
"""
import urllib.request
import json
import os
import subprocess
import sys
import time

API = "https://tts.wangwangit.com/v1/audio/speech"
VOICE = "zh-CN-XiaoqiuNeural"

SEGMENTS = [
    ("s0-title",
     "三分钟，回顾中考数学核心考点：几何与综合。"),

    ("s1-basics",
     "几何题先看对象。"
     "三角形先问：有没有边角相等、直角、平行线或比例关系。"
     "全等用来得到相等的边和角；相似用来得到比例；直角常把勾股和斜边中线带出来。"
     "四边形先分清类型。"
     "平行四边形看对边、对角和对角线；矩形、菱形、正方形，是在它上面再加直角、等边或对角线条件。"
     "面积题先找底和高。"
     "圆题要先连圆心。"
     "垂径定理看的是直径垂直于弦：它会平分这条弦，也平分对应的弧。"
     "同弧所对的圆周角相等；同一条弧上，圆心角是圆周角的两倍。"
     "看到切线，要把半径连到切点，再证垂直。"),

    ("s2-condition-map",
     "看到中点，想到中位线、倍长中线或平行四边形。"
     "看到角平分线，想到等角、性质、全等或相似。"
     "看到直角，想到勾股、H L 和斜边中线。"
     "看到平行，想到角相等、相似和平行四边形。"
     "看到圆先连圆心和半径；看到切线，先连半径再证垂直。"),

    ("s3-synthesis",
     "综合题先抓入口，但图形要跟着问题变。"
     "动点题先设变量，画出点从哪里走到哪里，再用变量表示长度、面积或坐标。"
     "面积题先找底和高，图上要能看出哪一段是底，哪一段是高，必要时用割补。"
     "最值题不要只盯着图形，常把关系转成二次函数、线段最短或三边关系。"
     "存在性问题先定分类标准，按位置、形状或符号分类，避免漏情况。"
     "函数几何综合，则把图形条件转成坐标、方程或函数关系。"),

    ("s4-pressure-score",
     "压轴题不一定一次做完。"
     "第一问要稳拿；第二问先找明显关系；"
     "最后一问暂时做不完，也要写下变量、关系式、分类或图形关系。"
     "步骤分来自有依据的数学关系。"),

    ("s5-pitfalls",
     "最容易丢分的位置要提前防住。"
     "几何题常丢在条件没用完、辅助线没目标、相似比例写反、半径和切线没连出来。"
     "综合题常丢在变量范围、分类讨论、最值条件和单位。"
     "越到后面，越先写清设什么、求什么、条件是什么。"),

    ("s6-outro",
     "几何与综合题先抓入口：条件通向方法，方法生成关系式。"
     "圆题先连圆心，综合题先设变量。"
     "压轴题做不完，也要写出关键关系，争取步骤分。"),
]


def get_audio_duration(path):
    try:
        out = subprocess.check_output(
            ["ffprobe", "-v", "error", "-show_entries",
             "format=duration", "-of",
             "default=noprint_wrappers=1:nokey=1", path],
            stderr=subprocess.STDOUT,
        )
        return float(out.decode().strip())
    except Exception as e:
        print(f"[warn] ffprobe failed: {e}", file=sys.stderr)
        return -1.0


def gen_tts(text, out_path):
    body = json.dumps({
        "input": text,
        "voice": VOICE,
        "speed": 1.0,
        "pitch": "0",
        "style": "general",
    }).encode("utf-8")
    req = urllib.request.Request(
        API, data=body, headers={"Content-Type": "application/json"})
    with urllib.request.urlopen(req, timeout=60) as r:
        audio = r.read()
    with open(out_path, "wb") as f:
        f.write(audio)


def main():
    out_dir = os.path.dirname(os.path.abspath(__file__))
    force = "--force" in sys.argv
    only = None
    if "--only" in sys.argv:
        try:
            only = sys.argv[sys.argv.index("--only") + 1]
        except IndexError:
            print("[error] --only requires a segment name", file=sys.stderr)
            sys.exit(2)
    results = []
    for name, text in SEGMENTS:
        out_path = os.path.join(out_dir, f"{name}.mp3")
        should_generate = force or (only == name)
        if os.path.exists(out_path) and not should_generate:
            print(f"[skip] {name}.mp3 exists")
        else:
            print(f"[gen] {name}: {text[:40]}...")
            try:
                gen_tts(text, out_path)
                time.sleep(0.3)
            except Exception as e:
                print(f"[error] {name} failed: {e}", file=sys.stderr)
                continue
        dur = get_audio_duration(out_path)
        results.append((name, dur, text))
        print(f"       -> {dur:.2f}s")

    manifest_path = os.path.join(out_dir, "voice_manifest.json")
    with open(manifest_path, "w", encoding="utf-8") as f:
        json.dump(
            [{"name": n, "duration": d, "text": t} for n, d, t in results],
            f, ensure_ascii=False, indent=2,
        )
    print("\n=== Done ===")
    total = sum(d for _, d, _ in results if d > 0)
    print(f"Total: {total:.2f}s ({total/60:.2f}min)")
    print(f"Manifest: {manifest_path}")


if __name__ == "__main__":
    main()
