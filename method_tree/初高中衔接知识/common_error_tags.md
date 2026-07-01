# 常见错因标签

错因标签用于练习反馈。反馈不应只说“错了”，而要指出结构原因。

## 核心错因 ID

核心错因 ID 用于题库、页面跳转和学习路径回退；下面各类英文标签用于更细的反馈定位。

| ID | 核心错因 | 对应细标签 |
| --- | --- | --- |
| `E_BRIDGE_001` | 整体平方误当分别平方 | `missing-cross-term` |
| `E_BRIDGE_002` | 平方差与差的平方混淆 | `object-mix`, `difference-required` |
| `E_BRIDGE_003` | 因式分解方法选择错误 | `common-factor-missed`, `constant-only-factor`, `cross-product-error`, `grouping-no-common-bracket`, `no-multiply-back-check` |
| `E_BRIDGE_004` | 约分后丢失禁点 | `domain-lost` |
| `E_BRIDGE_005` | 根式非负性错误 | `sqrt-absolute-missed` |
| `E_BRIDGE_006` | 方程增根未验 | `candidate-as-answer`, `extraneous-root` |
| `E_BRIDGE_007` | 不等式端点或禁点错误 | `endpoint-error`, `forbidden-point-included` |
| `E_BRIDGE_008` | 复合条件遗漏 | `compound-condition-missed` |
| `E_BRIDGE_009` | 因子与项混淆 | `factor-term-cancel` |
| `E_BRIDGE_010` | 化简后扩大原式范围 | `range-expanded` |

## 对象识别类

| 标签 | 说明 | 典型表现 |
| --- | --- | --- |
| `object-mix` | 对象混淆 | 把 `(a-b)^2` 当成 `a^2-b^2` |
| `direction-mix` | 变形方向混淆 | 把 `(a+b)^3` 和 `a^3+b^3` 混用 |
| `task-mismatch` | 方法不服务目标 | 需要看零点却只做展开 |
| `function-expression-mix` | 表达式和函数对象混淆 | 忽略定义域变化导致对象不同 |

## 公式结构类

| 标签 | 说明 | 典型表现 |
| --- | --- | --- |
| `missing-cross-term` | 漏交叉项 | `(a+b)^2=a^2+b^2` |
| `middle-term-mismatch` | 中间项不匹配 | 把 `x^2+8x+25` 写成完全平方 |
| `difference-required` | 平方差条件缺失 | 把 `a^2+b^2` 当平方差 |
| `cube-factor-sign` | 立方和差二次因子符号错误 | 混合项乘回去不能抵消 |
| `whole-cube-misread` | 整体立方误读 | 把整体立方当两个立方相加减 |

## 因式分解类

| 标签 | 说明 | 典型表现 |
| --- | --- | --- |
| `common-factor-missed` | 漏提公因式 | 每项有共同因子但未先提 |
| `constant-only-factor` | 只看常数项 | 十字相乘只满足乘积，不检查一次项 |
| `cross-product-error` | 交叉乘积错误 | 二次项和常数项对了，一次项不对 |
| `grouping-no-common-bracket` | 无效分组 | 分组后没有制造共同括号 |
| `whole-expanded-too-early` | 过早展开整体 | 重复整体被打散 |
| `complete-square-balance` | 配方未保持等值 | 补了数但没有减回去 |
| `no-multiply-back-check` | 未乘回检查 | 分解结果无法回到原式 |

## 条件控制类

| 标签 | 说明 | 典型表现 |
| --- | --- | --- |
| `domain-lost` | 原式条件丢失 | 约分后忘记原分母禁点 |
| `factor-term-cancel` | 因子和项混淆 | 把 `(x+1)/(x+2)` 中的 `x` 约掉 |
| `sqrt-absolute-missed` | 机械开方 | `sqrt(A^2)=A` |
| `compound-condition-missed` | 复合条件遗漏 | 只写根号条件，忘记分母条件 |
| `range-expanded` | 化简扩大范围 | 化简式允许的值被误认为原式也允许 |

## 解集追踪类

| 标签 | 说明 | 典型表现 |
| --- | --- | --- |
| `candidate-as-answer` | 候选解当最终解 | 算出根后不验回原式 |
| `extraneous-root` | 增根未筛 | 平方或去分母后多出解 |
| `solution-lost` | 丢根 | 除以可能为 `0` 的未知因子 |
| `inequality-flip` | 不等号方向错误 | 除以负数不改变方向 |
| `unknown-sign-divide` | 除以符号不确定式 | 直接约掉 `x-1` |
| `endpoint-error` | 端点取舍错误 | `>` 与 `>=` 混淆 |
| `forbidden-point-included` | 禁点误取 | 分式不等式把分母零点写入答案 |

## 反馈使用原则

反馈应包含三部分：

```text
错因标签
错在哪里
应该检查的结构或条件
```

例如：

```text
错因：missing-cross-term
你把整体平方当成分别平方了。
请先把 (a+b)^2 写成 (a+b)(a+b)，检查两个 ab 是否都出现。
```
