"""
批量生成 晓秋(zh-CN-XiaoqiuNeural) TTS 配音 + 测量 mp3 时长。
第零章：代数与函数快速回顾
"""
import urllib.request
import json
import os
import subprocess
import sys
import time

API   = "https://tts.wangwangit.com/v1/audio/speech"
VOICE = "zh-CN-XiaoqiuNeural"

SEGMENTS = [
    ("s0-title",
     "2 分钟，带你回顾中考数学核心考点——代数与函数。"),

    ("s2-calc",
     "代数的基础是运算。"
     "对于实数运算，根号 a 的平方等于 a 的绝对值，而绝对值恒大于等于零。"
     "对于整式运算，a 加 b 的平方等于 a 平方加 2 a b 加 b 平方。"
     "a 减 b 的平方等于 a 平方减 2 a b 加 b 平方。"
     "对于分式，我们要求分母不为零。"
     "而对于二次根式，同样要求被开方数大于等于零。"
     "掌握了运算规则，接下来看函数图像。"),

    ("s3-coord-linear",
     "给定两点坐标A和B，中点C的坐标为横纵坐标的平均值，"
     "两点距离d等于横坐标差的平方加上纵坐标差的平方，最后再开根号。"),

    ("s3b-linear",
     "将两点连接可以得到一条直线，这便是一次函数。"
     "k 是斜率，等于 y B 减 y A 除以 x B 减 x A；"
     "b 是与 y 轴的交点，等于 y A 减 k 乘 x A。"
     "固定 k 不变，改变 b，相当于垂直移动直线，移动后的直线与原直线平行。"),

    ("s4-inverse",
     "对于反比例函数，其是双曲线。"
     "当k 为正，曲线在一三象限，当k 为负，曲线在二四象限。"
     "图象上任意一点，横纵坐标之积等于 k。"),

    ("s5-quadratic",
     "对于二次函数，其是一条抛物线，对称轴为 x 等于负 b 除以 2a。"
     "当 a 大于零，开口向上，有最小值；当 a 小于零，开口向下，有最大值。"),

    ("s6-outro",
     "了解了代数与函数后，下一节我们将回顾几何图像。"),
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
    results = []
    for name, text in SEGMENTS:
        out_path = os.path.join(out_dir, f"{name}.mp3")
        if os.path.exists(out_path) and not force:
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
    print(f"\n=== Done ===")
    total = sum(d for _, d, _ in results if d > 0)
    print(f"Total: {total:.2f}s ({total/60:.2f}min)")
    print(f"Manifest: {manifest_path}")


if __name__ == "__main__":
    main()
