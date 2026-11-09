/* 客观题库 · 120 题（单选 50 / 多选 40 / 判断 30） */
window.QUESTIONS = [
  /* ============ llm 7 ============ */
  {
    id: "q001", type: "single", chapter: "llm", level: 2,
    stem: "关于大模型的上下文窗口，下列说法正确的是：",
    options: [
      "窗口越大，就应该把所有相关资料都塞进上下文",
      "注意力计算量随序列长度近似平方增长，长上下文更贵也更慢",
      "只要窗口足够大，长文档中段的信息就不会被遗漏",
      "上下文窗口大小与调用计费无关"
    ],
    answer: [1],
    explain: "自注意力的计算与显存开销随序列长度近似平方增长，长上下文意味着更高成本与更长延迟；同时存在「中间遗忘」，中段信息召回最弱，因此不能无脑塞满窗口。",
    tag: "上下文窗口"
  },
  {
    id: "q002", type: "single", chapter: "llm", level: 1,
    stem: "要从合同文本中稳定抽取结构化字段并输出 JSON，temperature 最合理的设置是：",
    options: ["1.2，增加多样性", "0.9，让表达更自然", "0.1 左右，降低随机性", "随机设置即可"],
    answer: [2],
    explain: "抽取、分类、JSON 输出属于确定性任务，应使用接近 0 的低温以获得稳定、可解析的结果；高温会引入措辞变化与格式漂移。",
    tag: "采样参数"
  },
  {
    id: "q003", type: "single", chapter: "llm", level: 2,
    stem: "某企业的产品价格与政策每周更新，希望问答系统及时反映最新内容。最合适的方案是：",
    options: ["对基座模型做全量微调", "使用 RAG，更新索引即可生效", "提高 temperature 让模型更灵活", "把上下文窗口扩到最大"],
    answer: [1],
    explain: "频繁变化的事实知识应放在外部可更新的知识库中，用 RAG 检索注入；微调适合固化风格与格式，不适合承载高频更新的知识。",
    tag: "微调与RAG"
  },
  {
    id: "q004", type: "multiple", chapter: "llm", level: 2,
    stem: "关于 Transformer 与自注意力，下列说法正确的有：",
    options: [
      "训练时可以整段序列并行计算，这是大模型可规模化的前提",
      "推理时按 token 自回归生成，逐个输出",
      "注意力计算量与序列长度成严格线性关系",
      "模型本身不具备连接数据库的事实核查能力，可能生成看似合理的错误内容"
    ],
    answer: [0, 1, 3],
    explain: "训练并行、推理自回归是基本事实；注意力开销随长度近似平方而非线性；模型只学统计规律，没有内置事实核查，因此会幻觉。",
    tag: "自注意力"
  },
  {
    id: "q005", type: "multiple", chapter: "llm", level: 2,
    stem: "以下哪些做法有助于降低回答中的事实型幻觉？",
    options: [
      "要求每个结论引用检索到的原文片段",
      "检索不到证据时明确回答不知道或转人工",
      "提高 temperature 让模型自由发挥",
      "对关键数字调用外部工具核验"
    ],
    answer: [0, 1, 3],
    explain: "幻觉治理靠证据约束、拒答策略与外部核验；提高温度只会增加随机性，与降低幻觉的目标相反。",
    tag: "幻觉治理"
  },
  {
    id: "q006", type: "judge", chapter: "llm", level: 2,
    stem: "把 temperature 设为 0，就能保证同一输入在每次调用中输出完全一致。",
    options: ["正确", "错误"],
    answer: [1],
    explain: "由于批处理、并行计算、硬件与模型版本差异，即使温度为 0 也不能保证逐字复现。需要强一致时应做输出校验与重试，而不是依赖随机种子。",
    tag: "可复现性"
  },
  {
    id: "q007", type: "judge", chapter: "llm", level: 2,
    stem: "上下文越长，模型对位于中段的信息利用通常越弱，这一现象被称为「中间遗忘」。",
    options: ["正确", "错误"],
    answer: [0],
    explain: "长上下文中模型对首尾信息利用更好，中段信息召回明显下降。工程上应把关键证据前置或后置，并对检索结果做重排。",
    tag: "中间遗忘"
  },

  /* ============ prompting 12 ============ */
  {
    id: "q008", type: "single", chapter: "prompting", level: 1,
    stem: "下列哪一项不属于高质量提示词的必备要素？",
    options: ["角色与能力边界", "明确的任务描述", "输出格式约束", "模型参数量说明"],
    answer: [3],
    explain: "提示词四要素是角色边界、任务、约束、输出格式；模型参数量由选型决定，与提示词写作无关。",
    tag: "指令四要素"
  },
  {
    id: "q009", type: "single", chapter: "prompting", level: 2,
    stem: "关于 few-shot 示例的使用，最合理的做法是：",
    options: [
      "固定放 10 个以上示例，越多越稳",
      "按相似度动态选取 2～5 个示例，并覆盖空值与拒答等边界情况",
      "只放简单正例，避免模型困惑",
      "把示例写进系统提示后就不再更新"
    ],
    answer: [1],
    explain: "示例应少而准、与当前输入相似，并覆盖边界情况；过多示例会挤占上下文、增加成本，只给正例则无法处理异常输入。",
    tag: "few-shot"
  },
  {
    id: "q010", type: "single", chapter: "prompting", level: 2,
    stem: "要让模型稳定输出符合指定字段的 JSON，可靠性最高的做法是：",
    options: [
      "在提示词里写「请务必输出 JSON」",
      "使用受约束解码或函数调用的 JSON Schema 约束",
      "提高 temperature 让输出更丰富",
      "把期望的 JSON 放在示例里即可"
    ],
    answer: [1],
    explain: "受约束解码或工具参数 Schema 由平台侧保证结构合法，可靠性最高；纯提示词约束需要额外解析与重试兜底。",
    tag: "结构化输出"
  },
  {
    id: "q011", type: "single", chapter: "prompting", level: 2,
    stem: "间接提示注入最典型的来源是：",
    options: [
      "用户在输入框里直接写「忽略以上指令」",
      "Agent 读取的网页、文档或工具返回内容中夹带的指令",
      "系统提示词本身",
      "模型训练数据中的标点符号"
    ],
    answer: [1],
    explain: "间接注入把恶意指令藏在外部数据里，模型读到后可能当作指令执行。这类内容来自看似可信的数据源，是 Agent 的高危攻击面。",
    tag: "间接注入"
  },
  {
    id: "q012", type: "single", chapter: "prompting", level: 2,
    stem: "在上下文分层设计中，角色设定、规则与输出契约属于哪一层？",
    options: ["易变的证据层", "相对稳定的系统层，适合缓存复用", "记忆层", "工具返回层"],
    answer: [1],
    explain: "系统层内容变化频率低，适合固定前置并利用前缀缓存；任务层与证据层每轮变化，应放在其后并控制长度。",
    tag: "上下文工程"
  },
  {
    id: "q013", type: "multiple", chapter: "prompting", level: 2,
    stem: "好的指令约束应当具备哪些特征？",
    options: [
      "可判定，例如「每个结论附原文编号」",
      "明确无证据时的拒答策略",
      "越模糊越好，给模型发挥空间",
      "明确输出字段、类型与取值范围"
    ],
    answer: [0, 1, 3],
    explain: "约束要能被检查、能指导异常处理、能约束输出结构；模糊表述会让模型自由发挥，导致不可测、不可控。",
    tag: "约束设计"
  },
  {
    id: "q014", type: "multiple", chapter: "prompting", level: 2,
    stem: "关于思维链（CoT），下列说法正确的有：",
    options: [
      "对多步计算、逻辑判断类任务通常有提升",
      "模型写出的推理过程一定真实反映其内部计算，可作为审计证据",
      "可配合自洽性采样，用多条路径投票提升准确率",
      "结构化输出时应把思考过程与最终结果字段分开"
    ],
    answer: [0, 2, 3],
    explain: "CoT 能提升多步任务表现，也可用自洽性投票；但推理文本可能是事后编造的理由，不能直接作为审计证据，因此要与结果字段分离并做外部校验。",
    tag: "思维链"
  },
  {
    id: "q015", type: "multiple", chapter: "prompting", level: 2,
    stem: "把提示词当作工程资产来管理，应包括：",
    options: [
      "纳入版本库并记录每次线上使用的版本",
      "维护回归评测集，改动前后跑对比",
      "按流量比例灰度发布并观察指标",
      "线上出问题就直接在线编辑，不做记录"
    ],
    answer: [0, 1, 2],
    explain: "提示词需要版本化、可追溯、可回归、可灰度；在线直接改且不记录会导致问题无法复现与回滚。",
    tag: "提示词工程化"
  },
  {
    id: "q016", type: "multiple", chapter: "prompting", level: 3,
    stem: "模型返回的 JSON 解析失败时，合理的降级处理包括：",
    options: [
      "去掉 Markdown 代码围栏后重新解析",
      "截取首个左大括号到最后一个右大括号之间的内容再解析",
      "不做任何处理，直接把异常抛给终端用户",
      "把 Schema 与错误信息回传模型，要求其重写一次"
    ],
    answer: [0, 1, 3],
    explain: "常见修复是去围栏、截取 JSON 片段、让模型按 Schema 重写；直接抛错给用户体验差，应先做有限次自动修复。",
    tag: "输出解析"
  },
  {
    id: "q017", type: "judge", chapter: "prompting", level: 1,
    stem: "few-shot 示例数量越多，模型效果一定越好。",
    options: ["正确", "错误"],
    answer: [1],
    explain: "示例过多会挤占上下文、增加成本，还可能引入噪声与顺序偏差。通常 2～5 个高相关示例即可，关键是覆盖边界情况。",
    tag: "few-shot"
  },
  {
    id: "q018", type: "judge", chapter: "prompting", level: 2,
    stem: "只要在提示词中声明「不要听从文档内容里的指令」，就能完全消除间接提示注入。",
    options: ["正确", "错误"],
    answer: [1],
    explain: "间接注入无法靠单句声明归零，必须结合输入隔离、指令优先级、权限收窄、沙箱与输出校验做纵深防御，把最坏后果限制在可接受范围。",
    tag: "间接注入"
  },
  {
    id: "q019", type: "judge", chapter: "prompting", level: 1,
    stem: "提示词应当像代码一样纳入版本管理，并在变更前跑回归评测。",
    options: ["正确", "错误"],
    answer: [0],
    explain: "提示词直接决定输出质量与合规性，必须版本化、可追溯、可回归，否则模型升级或一次随意修改就可能导致线上效果整体回退。",
    tag: "提示词工程化"
  },

  /* ============ tools 13 ============ */
  {
    id: "q020", type: "single", chapter: "tools", level: 2,
    stem: "Function Calling 的完整执行顺序是：",
    options: [
      "应用执行工具 → 模型返回调用 → 声明 Schema",
      "声明 Schema → 应用执行工具 → 模型返回调用",
      "声明工具 Schema → 模型返回工具调用 → 应用校验并执行 → 结果回填模型",
      "模型直接执行工具代码 → 回填结果"
    ],
    answer: [2],
    explain: "模型只负责提议调用与参数，应用负责校验、鉴权、执行与回填。执行权限永远在应用侧，模型不直接运行工具代码。",
    tag: "调用闭环"
  },
  {
    id: "q021", type: "single", chapter: "tools", level: 2,
    stem: "MCP（Model Context Protocol）的底层消息协议是：",
    options: ["gRPC", "JSON-RPC 2.0", "SOAP", "GraphQL"],
    answer: [1],
    explain: "MCP 基于 JSON-RPC 2.0 定义请求、响应与通知，传输层支持本地 stdio 与远程 Streamable HTTP 等方式。",
    tag: "MCP协议"
  },
  {
    id: "q022", type: "single", chapter: "tools", level: 2,
    stem: "MCP Server 向模型侧暴露的三类核心原语是：",
    options: [
      "tools、resources、prompts",
      "tools、agents、memory",
      "models、prompts、tools",
      "resources、logs、metrics"
    ],
    answer: [0],
    explain: "MCP 的三类原语是 tools（可执行动作）、resources（可读取的上下文数据）、prompts（预置提示模板），能力在初始化握手时协商。",
    tag: "MCP原语"
  },
  {
    id: "q023", type: "single", chapter: "tools", level: 2,
    stem: "单场景常驻工具数量过多，最直接的影响是：",
    options: [
      "模型参数量变大",
      "模型选择正确工具的准确率下降",
      "上下文窗口自动扩大",
      "网络延迟必然降低"
    ],
    answer: [1],
    explain: "候选工具过多会增加歧义与干扰，导致选错工具、漏调或多调。应按意图路由到工具子集，或先选工具集再选工具。",
    tag: "工具选择"
  },
  {
    id: "q024", type: "single", chapter: "tools", level: 2,
    stem: "工具返回「超时，可重试」时，Agent 最合理的行为是：",
    options: [
      "无限重试直到成功",
      "有限次退避重试，仍失败则降级或转人工",
      "自行编造一个结果继续",
      "忽略错误并声称任务完成"
    ],
    answer: [1],
    explain: "可重试错误应设上限与退避，超过上限后走降级或人工接管；无限重试会放大故障与成本，编造结果则更危险。",
    tag: "错误处理"
  },
  {
    id: "q025", type: "multiple", chapter: "tools", level: 2,
    stem: "设计工具 Schema 时，应遵循的原则有：",
    options: [
      "工具名语义化，避免同义工具并存",
      "参数使用枚举、格式示例与范围约束",
      "描述中写清「何时使用、何时不要使用」",
      "一个工具塞入尽可能多的参数以减少工具数量"
    ],
    answer: [0, 1, 2],
    explain: "语义化命名、参数约束、使用边界描述都能提升选择与填参准确率；参数过多会让模型难以正确填充，应拆分或简化。",
    tag: "工具Schema"
  },
  {
    id: "q026", type: "multiple", chapter: "tools", level: 2,
    stem: "MCP 架构中的角色包括：",
    options: ["Host（宿主应用）", "Client（连接客户端）", "Server（能力提供方）", "Router（模型路由器）"],
    answer: [0, 1, 2],
    explain: "MCP 定义 Host、Client、Server 三个角色：Host 内为每个 Server 建立 Client 连接，Server 提供工具、资源与提示能力。",
    tag: "MCP架构"
  },
  {
    id: "q027", type: "multiple", chapter: "tools", level: 2,
    stem: "把工具结果回填给模型时，正确做法包括：",
    options: [
      "只回填必要字段，裁剪无关内容",
      "标注数据来源与获取时间",
      "把原始 HTML 全量塞回上下文",
      "结果超长时先摘要再回填，原始数据留在服务端备查"
    ],
    answer: [0, 1, 3],
    explain: "回填要短、准、可溯源；全量原始内容会撑爆上下文并引入噪声。超长结果应摘要，原始数据另行存储供引用。",
    tag: "结果回填"
  },
  {
    id: "q028", type: "multiple", chapter: "tools", level: 2,
    stem: "保障工具调用安全的措施包括：",
    options: [
      "最小权限，读写工具分离",
      "对参数做类型、枚举与注入校验",
      "限制出站域名与网段，禁止访问云元数据地址",
      "把工具执行权限完全交给模型判断"
    ],
    answer: [0, 1, 2],
    explain: "工具安全依赖最小权限、参数校验与出站控制；模型可能被注入操纵，执行权限与鉴权必须保留在应用侧。",
    tag: "工具安全"
  },
  {
    id: "q029", type: "multiple", chapter: "tools", level: 2,
    stem: "以下哪些情况适合让模型并行发起多个工具调用？",
    options: [
      "同时查询天气、汇率等互不依赖的信息",
      "后一步的参数来自前一步的返回结果",
      "从多个独立数据源聚合信息",
      "需要按顺序确认的写操作"
    ],
    answer: [0, 2],
    explain: "并行适用于无依赖的独立调用；存在参数依赖或需要顺序确认的写操作必须串行，否则会产生错误参数或重复副作用。",
    tag: "并行调用"
  },
  {
    id: "q030", type: "judge", chapter: "tools", level: 1,
    stem: "工具的执行权限与鉴权应保留在应用侧，而不是交给模型判断。",
    options: ["正确", "错误"],
    answer: [0],
    explain: "模型只负责提议调用，真实执行与权限校验必须在应用侧完成。把权限交给模型等于把安全建立在提示词之上，极易被注入绕过。",
    tag: "权限边界"
  },
  {
    id: "q031", type: "judge", chapter: "tools", level: 2,
    stem: "MCP 解决的是工具与资源的标准化接入，不负责 Agent 的编排、记忆与业务正确性。",
    options: ["正确", "错误"],
    answer: [0],
    explain: "MCP 定位是「AI 世界的 USB-C」，统一接入协议；编排、状态管理、记忆与业务流程仍需上层系统自行设计。",
    tag: "MCP定位"
  },
  {
    id: "q032", type: "judge", chapter: "tools", level: 2,
    stem: "同一场景下常驻的工具越多，模型选择正确工具的概率通常越高。",
    options: ["正确", "错误"],
    answer: [1],
    explain: "工具越多，语义重叠与干扰越大，选择准确率通常下降。应控制常驻数量，或先做工具集路由再在子集内选择。",
    tag: "工具选择"
  },

  /* ============ agent 13 ============ */
  {
    id: "q033", type: "single", chapter: "agent", level: 1,
    stem: "下列哪一项不属于智能体的必备要素？",
    options: ["目标", "工具", "记忆与状态", "固定的界面布局"],
    answer: [3],
    explain: "智能体四要素是目标、工具、记忆/状态、循环控制；界面布局属于产品呈现，与智能体能力无关。",
    tag: "智能体定义"
  },
  {
    id: "q034", type: "single", chapter: "agent", level: 1,
    stem: "ReAct 范式的单步循环是：",
    options: [
      "思考 → 行动 → 观察",
      "训练 → 推理 → 部署",
      "检索 → 排序 → 生成",
      "规划 → 审批 → 发布"
    ],
    answer: [0],
    explain: "ReAct 让模型交替输出思考与行动，执行后获得观察结果，再进入下一步，直到信息足够或触发终止条件。",
    tag: "ReAct"
  },
  {
    id: "q035", type: "single", chapter: "agent", level: 2,
    stem: "与 ReAct 相比，Plan-and-Execute 的主要优势是：",
    options: [
      "每一步都更灵活，适合信息高度不确定的探索",
      "先全局规划，步骤可控、可并行、便于审计",
      "完全不依赖大模型",
      "token 成本一定更低"
    ],
    answer: [1],
    explain: "Plan-and-Execute 先产出子任务计划再执行，可控性与可审计性更好，也便于并行；代价是计划本身错误会连锁失败。",
    tag: "Plan-and-Execute"
  },
  {
    id: "q036", type: "single", chapter: "agent", level: 2,
    stem: "防止 Agent 陷入死循环，最有效的组合是：",
    options: [
      "提高 temperature 让模型跳出循环",
      "动作去重、步数上限、状态哈希比对、超限升级人工",
      "换成参数量更大的模型",
      "把提示词写得更长更详细"
    ],
    answer: [1],
    explain: "死循环要从工程侧兜底：重复动作检测、最大步数、状态快照去重、超限转人工，四件套配合使用才能稳定止血。",
    tag: "死循环"
  },
  {
    id: "q037", type: "single", chapter: "agent", level: 2,
    stem: "以下场景中最不适合使用自主 Agent 的是：",
    options: [
      "开放式行业研究，需要多轮检索与归纳",
      "路径固定的审批流，每步规则明确",
      "跨系统故障排查，需要根据现象调整方向",
      "多来源信息汇总，子任务可并行"
    ],
    answer: [1],
    explain: "路径固定的流程用工作流更可控、可测、便宜；让 Agent 自主决策只会增加不确定性，属于过度工程。",
    tag: "Agent适用边界"
  },
  {
    id: "q038", type: "multiple", chapter: "agent", level: 2,
    stem: "Agent 主循环工程化必须包含：",
    options: [
      "任务状态落库，支持断点续跑",
      "步数、token、时长、费用等预算上限",
      "目标达成、明确失败、需人工、预算耗尽四类终止出口",
      "失败后无限自主重试"
    ],
    answer: [0, 1, 2],
    explain: "状态、预算、终止条件是 Agent 可控的前提；无限重试会放大故障与成本，应改为有限重试加降级。",
    tag: "主循环"
  },
  {
    id: "q039", type: "multiple", chapter: "agent", level: 2,
    stem: "Agent 的典型失败模式包括：",
    options: [
      "反复调用同一工具、同一参数",
      "长轨迹后遗忘初始目标",
      "在不适用的场景误用工具",
      "模型参数量不够大"
    ],
    answer: [0, 1, 2],
    explain: "死循环、目标漂移、工具误用、上下文爆炸、过度自信、越权行动都是典型失败模式；参数量不是失败模式的分类维度。",
    tag: "失败模式"
  },
  {
    id: "q040", type: "multiple", chapter: "agent", level: 3,
    stem: "关于 Reflection（自我反思）机制，正确的说法有：",
    options: [
      "应配合单元测试、Schema 校验等外部可验证信号",
      "仅靠模型自评就能发现所有错误",
      "可用于失败后沉淀经验、下一轮重试",
      "评审者与生成者分离可降低自我确认偏差"
    ],
    answer: [0, 2, 3],
    explain: "模型自评存在盲区，尤其难以发现自己不知道的错误；有效做法是引入外部验证信号，并让评审与生成角色分离。",
    tag: "Reflection"
  },
  {
    id: "q041", type: "multiple", chapter: "agent", level: 2,
    stem: "以下哪些操作应设置 human-in-the-loop 人工审批点？",
    options: ["对外转账", "删除生产数据", "以公司名义对外发送邮件", "只读查询公开资料"],
    answer: [0, 1, 2],
    explain: "高风险、不可逆或对外产生影响的写操作必须人工确认；只读查询风险低，可按规则自动执行。",
    tag: "人工审批"
  },
  {
    id: "q042", type: "multiple", chapter: "agent", level: 2,
    stem: "关于工作流与 Agent 的关系，正确的表述有：",
    options: [
      "工作流路径预先编排，可控、可测、成本较低",
      "Agent 在运行时自主决定下一步，灵活但不确定性更高",
      "生产系统常采用「工作流骨架 + 局部 Agent」的混合形态",
      "Agent 在所有场景下都优于工作流"
    ],
    answer: [0, 1, 2],
    explain: "两者是取舍关系而非替代关系：路径能写死就用工作流，需要现场判断才交给 Agent，混合形态最常见。",
    tag: "工作流与Agent"
  },
  {
    id: "q043", type: "judge", chapter: "agent", level: 1,
    stem: "只要接入大模型并挂上几个工具，系统就可以称为智能体。",
    options: ["正确", "错误"],
    answer: [1],
    explain: "智能体还需要目标、记忆/状态与循环控制，能多步推进任务。单轮问答加工具只是工具增强的对话系统。",
    tag: "智能体定义"
  },
  {
    id: "q044", type: "judge", chapter: "agent", level: 2,
    stem: "Agent 执行写操作时应携带幂等键，避免重试造成重复下单或重复发送。",
    options: ["正确", "错误"],
    answer: [0],
    explain: "超时不等于失败，请求可能已执行。写操作必须用业务幂等键在服务端去重，这是防止重复副作用的基本要求。",
    tag: "幂等"
  },
  {
    id: "q045", type: "judge", chapter: "agent", level: 2,
    stem: "Agent 的终止条件只需要「目标达成」一种即可。",
    options: ["正确", "错误"],
    answer: [1],
    explain: "还必须有明确失败、需要人工介入、预算耗尽三类出口，否则任务无法收敛时会无限运行或卡死。",
    tag: "终止条件"
  },

  /* ============ rag 13 ============ */
  {
    id: "q046", type: "single", chapter: "rag", level: 1,
    stem: "RAG 最主要解决的是：",
    options: [
      "模型参数量不足的问题",
      "知识时效性、私有知识与答案可溯源的问题",
      "模型推理速度慢的问题",
      "用户意图识别不准的问题"
    ],
    answer: [1],
    explain: "RAG 通过外部检索把最新、私有、可引用的证据注入上下文，解决知识更新与溯源；它不改变模型参数规模，也不直接提升意图识别。",
    tag: "RAG定位"
  },
  {
    id: "q047", type: "single", chapter: "rag", level: 2,
    stem: "中文企业文档切分时，较常用的块大小与重叠比例是：",
    options: ["20～30 字，无重叠", "300～600 字，重叠 10%～20%", "5000 字以上，重叠 50%", "整篇文档不切分"],
    answer: [1],
    explain: "块过小会丢失上下文，过大则召回不准。中文常用 300～600 字并保留 10%～20% 重叠，同时尽量按标题与段落等结构边界切分。",
    tag: "切分策略"
  },
  {
    id: "q048", type: "single", chapter: "rag", level: 2,
    stem: "查询中包含大量产品型号、合同编号等专有词时，最应补充：",
    options: ["纯向量检索", "BM25 等关键词检索做混合召回", "把 top-k 调到 1000", "提高生成温度"],
    answer: [1],
    explain: "向量检索对精确字符串不敏感，BM25 擅长编号与专有名词。混合检索加 RRF 融合能同时覆盖精确匹配与语义相近。",
    tag: "混合检索"
  },
  {
    id: "q049", type: "single", chapter: "rag", level: 2,
    stem: "多租户 RAG 系统中，权限过滤应当发生在：",
    options: ["检索之前，作为元数据过滤条件", "生成答案之后，删除越权内容", "用户投诉之后", "不需要过滤，靠模型自觉"],
    answer: [0],
    explain: "必须在检索阶段就按租户与密级过滤，避免越权内容进入模型上下文。生成后再删已经太晚，敏感信息可能已被模型读取或泄露。",
    tag: "权限过滤"
  },
  {
    id: "q050", type: "single", chapter: "rag", level: 2,
    stem: "Recall@k 属于 RAG 评估中的哪一层指标？",
    options: ["生成层", "检索层", "业务层", "系统层"],
    answer: [1],
    explain: "Recall@k 衡量前 k 个检索结果中命中相关文档的比例，属于检索层；生成层看忠实度与答案相关性，业务层看解决率等。",
    tag: "RAG评估"
  },
  {
    id: "q051", type: "multiple", chapter: "rag", level: 2,
    stem: "RAG 回答质量差的常见原因包括：",
    options: [
      "答案跨两个块被切断，单块信息不完整",
      "表格解析错乱，行列对应关系丢失",
      "缺少租户与密级过滤，召回无关或越权内容",
      "检索块越大效果一定越好"
    ],
    answer: [0, 1, 2],
    explain: "切分断裂、表格解析、权限与时效过滤缺失都是高频原因；块大小需要平衡，并非越大越好。",
    tag: "RAG失败"
  },
  {
    id: "q052", type: "multiple", chapter: "rag", level: 2,
    stem: "文档入库时应保留的元数据包括：",
    options: ["页码与章节路径", "文档标题与版本", "生效日期与密级", "文件在磁盘上的绝对路径"],
    answer: [0, 1, 2],
    explain: "页码与章节用于引用与上下文补全，标题版本用于去重与更新，生效日期与密级用于时效和权限过滤；磁盘路径既无用又可能泄露信息。",
    tag: "元数据"
  },
  {
    id: "q053", type: "multiple", chapter: "rag", level: 2,
    stem: "混合检索通常由哪些部分组成？",
    options: ["BM25 关键词检索", "向量语义检索", "RRF 等排名融合", "随机采样候选块"],
    answer: [0, 1, 2],
    explain: "混合检索把关键词与向量两路结果用 RRF 等方式融合，兼顾精确匹配与语义相近；随机采样不构成检索策略。",
    tag: "混合检索"
  },
  {
    id: "q054", type: "multiple", chapter: "rag", level: 2,
    stem: "重排（rerank）环节的作用包括：",
    options: [
      "对粗排候选做更精细的相关性打分",
      "提升送入上下文的证据相关性",
      "减少上下文中的噪声与无关块",
      "替代生成模型直接产出答案"
    ],
    answer: [0, 1, 2],
    explain: "重排用交叉编码器对候选逐对打分，提升相关性并压缩噪声；它不生成答案，仍由大模型基于证据作答。",
    tag: "重排"
  },
  {
    id: "q055", type: "multiple", chapter: "rag", level: 3,
    stem: "父子块（小块检索、父块供给）策略的好处包括：",
    options: [
      "小块检索更精准，命中率高",
      "父块提供更完整的上下文，避免答案被切断",
      "可以完全省略切分与解析步骤",
      "兼顾检索精度与生成时的信息完整性"
    ],
    answer: [0, 1, 3],
    explain: "父子块用小粒度提升召回精度，命中后取父块补全上下文；它仍依赖解析与切分，不能省略基础工程。",
    tag: "父子块"
  },
  {
    id: "q056", type: "judge", chapter: "rag", level: 1,
    stem: "引入 RAG 之后，模型就不会再产生幻觉。",
    options: ["正确", "错误"],
    answer: [1],
    explain: "RAG 只能降低无依据编造，模型仍可能误读证据、错误推理或超出证据范围作答。必须配合引用校验、拒答策略与抽检。",
    tag: "RAG与幻觉"
  },
  {
    id: "q057", type: "judge", chapter: "rag", level: 2,
    stem: "拼装上下文时，把最关键的证据块放在最前面，有助于对抗「中间遗忘」。",
    options: ["正确", "错误"],
    answer: [0],
    explain: "模型对首尾信息利用更好，关键证据前置（或后置）能提升利用率；这也是重排后仍需考虑顺序的原因。",
    tag: "上下文拼装"
  },
  {
    id: "q058", type: "judge", chapter: "rag", level: 2,
    stem: "更换 embedding 模型后，可以直接复用旧索引中的向量继续检索。",
    options: ["正确", "错误"],
    answer: [1],
    explain: "不同 embedding 模型的向量空间不兼容，混用会导致相似度失真。换模型必须全量重建索引，新旧索引不能混查。",
    tag: "向量索引"
  },

  /* ============ memory 9 ============ */
  {
    id: "q059", type: "single", chapter: "memory", level: 2,
    stem: "用户明确说「以后不要给我推荐 A 品牌」，这条信息最适合存放在：",
    options: ["工作记忆中的临时变量", "结构化用户约束记忆", "组织公共知识库", "模型权重中"],
    answer: [1],
    explain: "这是跨会话生效的用户约束，应写入结构化长期记忆并带来源与时间；放在临时上下文里会被窗口裁掉，放知识库则会污染公共资料。",
    tag: "用户约束"
  },
  {
    id: "q060", type: "single", chapter: "memory", level: 2,
    stem: "用户先说常住深圳，三个月后说已搬去杭州，记忆系统应：",
    options: [
      "直接覆盖旧值，不保留历史",
      "保留版本与时间戳，检索时取生效中的最新一条",
      "随机保留其中一条",
      "两条都删除"
    ],
    answer: [1],
    explain: "记忆事实应带 valid_from/valid_to 与来源，冲突时做版本而不是物理覆盖，既保证答案最新，又保留审计与回滚能力。",
    tag: "记忆冲突"
  },
  {
    id: "q061", type: "single", chapter: "memory", level: 2,
    stem: "多租户记忆检索时，租户过滤条件应在何时生效？",
    options: ["向量检索阶段就作为过滤条件", "生成答案后检查并删除", "写入日志时", "不需要，模型会自行区分"],
    answer: [0],
    explain: "过滤必须在检索阶段完成，确保其他租户的记忆根本不进入候选集；事后删除无法阻止敏感信息已经进入模型上下文。",
    tag: "多租户隔离"
  },
  {
    id: "q062", type: "single", chapter: "memory", level: 2,
    stem: "长期记忆与 RAG 知识库的核心区别是：",
    options: [
      "两者完全等价，可以混存",
      "记忆是关于单个用户或任务的私有状态，知识库是组织公共资料",
      "记忆不需要向量检索",
      "RAG 不能存储文档"
    ],
    answer: [1],
    explain: "知识库面向所有人共享、按文档版本管理；记忆按用户隔离、随对话增量写入。两者可以共用检索服务，但隔离与生命周期必须分开设计。",
    tag: "记忆与RAG"
  },
  {
    id: "q063", type: "multiple", chapter: "memory", level: 2,
    stem: "管理短期会话记忆的常用手段包括：",
    options: ["滑动窗口只保留最近 N 轮", "把早期对话摘要成要点", "抽取结构化槽位（订单号、诉求、禁忌）", "把全部历史永久保留在上下文中"],
    answer: [0, 1, 2],
    explain: "窗口、摘要、结构化槽位三者组合可在控制长度的同时保留关键约束；全量保留会撑爆上下文并增加成本。",
    tag: "短期记忆"
  },
  {
    id: "q064", type: "multiple", chapter: "memory", level: 2,
    stem: "长期记忆的完整生命周期包括：",
    options: ["写入", "检索", "更新", "遗忘"],
    answer: [0, 1, 2, 3],
    explain: "只做写入与检索是不够的；更新保证事实不过期，遗忘满足合规与降噪要求，四步缺一不可。",
    tag: "记忆生命周期"
  },
  {
    id: "q065", type: "multiple", chapter: "memory", level: 2,
    stem: "记忆系统在隐私合规方面应满足：",
    options: [
      "支持用户查询、更正与删除记忆",
      "只收集完成任务所必需的信息",
      "健康、财务等敏感属性需单独授权",
      "默认永久保存全部对话以便训练"
    ],
    answer: [0, 1, 2],
    explain: "对齐个人信息保护法：可撤回可删除、最小必要、敏感信息单独同意；默认永久保存全部对话不符合最小必要与留存期限要求。",
    tag: "记忆合规"
  },
  {
    id: "q066", type: "judge", chapter: "memory", level: 2,
    stem: "模型根据对话推断出的用户偏好，可以直接作为用户明确表达的事实写入长期记忆。",
    options: ["正确", "错误"],
    answer: [1],
    explain: "推断结果置信度低且可能出错，应与用户明确表达区分，标注来源与置信度，低置信度不写入或仅作弱提示。",
    tag: "记忆写入"
  },
  {
    id: "q067", type: "judge", chapter: "memory", level: 2,
    stem: "记忆事实应携带来源、时间戳与置信度，以便处理冲突与审计。",
    options: ["正确", "错误"],
    answer: [0],
    explain: "没有来源与时间就无法判断新旧与真伪，也无法在出错时追溯。这三个字段是记忆可维护性的基础。",
    tag: "记忆元数据"
  },

  /* ============ multiagent 10 ============ */
  {
    id: "q068", type: "single", chapter: "multiagent", level: 2,
    stem: "以下哪组条件最适合采用多智能体架构？",
    options: [
      "任务可分解为较独立子任务，且需要不同角色与工具",
      "任何任务都应使用多智能体以显得先进",
      "单轮事实问答，要求毫秒级响应",
      "固定审批流，每步规则完全确定"
    ],
    answer: [0],
    explain: "多智能体的收益来自任务可分解、能力异构、可并行与对抗校验；单轮问答与固定流程用单 Agent 或工作流更划算。",
    tag: "适用条件"
  },
  {
    id: "q069", type: "single", chapter: "multiagent", level: 2,
    stem: "生产环境中最稳妥的多智能体编排方式是：",
    options: [
      "让所有角色在群聊里自由认领任务",
      "Orchestrator-Worker 结构配合明确的状态机",
      "无限轮辩论直到达成一致",
      "不做编排，让模型自行决定"
    ],
    answer: [1],
    explain: "主管拆解分派加状态机约束，既保留局部自主又可控制流程、预算与失败处理；自由群聊与无限辩论不可控且成本高。",
    tag: "编排模式"
  },
  {
    id: "q070", type: "single", chapter: "multiagent", level: 2,
    stem: "多智能体系统的成本大致可以估算为：",
    options: [
      "与单角色成本相同",
      "各角色调用成本之和乘以交互轮次",
      "与角色数量无关",
      "固定按订阅收费"
    ],
    answer: [1],
    explain: "每个角色每轮都要调用模型，交互轮次会放大总消耗，因此成本近似为各角色成本之和乘以轮次，设计时必须先算这笔账。",
    tag: "成本估算"
  },
  {
    id: "q071", type: "single", chapter: "multiagent", level: 2,
    stem: "定义多智能体中的单个角色时，必须明确的是：",
    options: [
      "输入契约、输出契约、工具权限与失败语义",
      "角色的头像与昵称",
      "角色的说话语气",
      "角色使用的字体"
    ],
    answer: [0],
    explain: "角色能否协作取决于接口是否清晰：接收什么、产出什么、能用哪些工具、失败时怎么做，这四项缺一不可。",
    tag: "角色契约"
  },
  {
    id: "q072", type: "multiple", chapter: "multiagent", level: 2,
    stem: "多智能体系统特有的故障包括：",
    options: [
      "角色互相等待对方输出导致停滞",
      "多个 Worker 重复执行同一子任务",
      "辩论模式无限僵持、无法收敛",
      "系统自动收敛到最优解"
    ],
    answer: [0, 1, 2],
    explain: "等待、重复劳动、僵持是多智能体典型问题，需要超时、任务认领去重、轮次上限与裁决者来解决。",
    tag: "多智能体故障"
  },
  {
    id: "q073", type: "multiple", chapter: "multiagent", level: 2,
    stem: "保证多智能体状态一致性的做法包括：",
    options: [
      "使用中心化状态存储，所有角色读写同一份",
      "角色之间传递结构化消息而非自由文本长文",
      "并发写同一资源时使用版本号或锁",
      "让每个角色各自维护一份自由格式的聊天记录"
    ],
    answer: [0, 1, 2],
    explain: "中心化状态、结构化消息、版本控制能避免信息漂移与覆盖；各自维护自由文本记录会导致状态分叉、无法对齐。",
    tag: "状态一致性"
  },
  {
    id: "q074", type: "multiple", chapter: "multiagent", level: 2,
    stem: "适合拆分为多智能体的场景有：",
    options: [
      "需要调研、写作、审校多角色协作的研究报告",
      "需要生成方与评审方分离的高风险决策",
      "固定规则的报销审批流",
      "多个互不依赖的子任务可并行处理"
    ],
    answer: [0, 1, 3],
    explain: "角色异构、对抗校验、可并行是多智能体的用武之地；固定审批流用工作流更简单可靠。",
    tag: "适用场景"
  },
  {
    id: "q075", type: "judge", chapter: "multiagent", level: 1,
    stem: "多智能体系统中角色数量越多，系统整体能力一定越强。",
    options: ["正确", "错误"],
    answer: [1],
    explain: "角色增加会带来通信开销、状态不一致与成本上升，职责重叠时甚至会互相干扰。判断标准是拆分是否带来明确收益。",
    tag: "角色数量"
  },
  {
    id: "q076", type: "judge", chapter: "multiagent", level: 2,
    stem: "LangGraph 类框架以「图 + 状态」为中心，强调流程可控与状态持久化。",
    options: ["正确", "错误"],
    answer: [0],
    explain: "LangGraph 用节点与边描述流程、显式管理状态，便于持久化、断点续跑与人工介入；AutoGen 更偏对话驱动，CrewAI 更偏角色任务驱动。",
    tag: "框架选型"
  },
  {
    id: "q077", type: "judge", chapter: "multiagent", level: 2,
    stem: "评测多智能体系统时，只需要看最终答案是否正确。",
    options: ["正确", "错误"],
    answer: [1],
    explain: "还要评编排层（拆分分派）、角色层（输出合规与工具准确）、协作层（消息消费、冲突解决、重复劳动），否则无法定位问题。",
    tag: "多智能体评测"
  },

  /* ============ architecture 11 ============ */
  {
    id: "q078", type: "single", chapter: "architecture", level: 2,
    stem: "Agent 任务通常需要数十秒到数分钟，最合理的接口设计是：",
    options: [
      "同步 HTTP 请求，把网关超时调到 30 分钟",
      "异步提交任务返回 task_id，通过轮询或推送获取进度",
      "让前端定时重发请求",
      "不返回结果，让用户刷新页面"
    ],
    answer: [1],
    explain: "长任务应异步化：提交后立即返回 task_id，客户端轮询或订阅事件流，同时支持取消与断点续跑，避免连接占用与重复提交。",
    tag: "同步与异步"
  },
  {
    id: "q079", type: "single", chapter: "architecture", level: 2,
    stem: "对写操作进行重试时，必须配套的机制是：",
    options: ["幂等键与服务端去重", "提高模型温度", "把超时调大", "忽略错误继续执行"],
    answer: [0],
    explain: "超时不等于未执行，重试可能造成重复副作用。写操作要带业务幂等键，由服务端保证同一请求只生效一次。",
    tag: "幂等"
  },
  {
    id: "q080", type: "single", chapter: "architecture", level: 2,
    stem: "执行模型生成的代码时，正确的做法是：",
    options: [
      "直接在应用进程内执行，性能最好",
      "在容器或微虚拟机等隔离沙箱中执行，并限制资源与网络",
      "用正则黑名单过滤危险函数即可",
      "以管理员权限执行以便访问依赖"
    ],
    answer: [1],
    explain: "代码执行必须靠内核级隔离边界，配合 CPU/内存/时长限制与出站白名单；正则过滤容易被绕过，不能作为沙箱。",
    tag: "沙箱"
  },
  {
    id: "q081", type: "single", chapter: "architecture", level: 2,
    stem: "降低 Agent 单任务成本，通常优先级最高的手段是：",
    options: [
      "对重复问题与稳定前缀做缓存",
      "换用更贵更大的模型",
      "把上下文长度加倍",
      "增加重试次数以提升成功率"
    ],
    answer: [0],
    explain: "缓存命中可直接省掉整次调用，性价比最高；其后才是模型分流、上下文裁剪与批处理。",
    tag: "成本优化"
  },
  {
    id: "q082", type: "single", chapter: "architecture", level: 2,
    stem: "企业级 Agent 平台常见的多租户层级模型是：",
    options: ["tenant → workspace → user", "只有 user 一层", "按 IP 地址划分", "不做隔离"],
    answer: [0],
    explain: "三级模型便于按企业、工作空间、个人逐级隔离数据与配额；只按用户或 IP 划分无法满足企业共享与权限管理需求。",
    tag: "多租户"
  },
  {
    id: "q083", type: "multiple", chapter: "architecture", level: 2,
    stem: "模型服务不可用时的合理降级路径包括：",
    options: [
      "返回不依赖 RAG 的保守回答",
      "返回缓存中的同类答案并标注",
      "转人工客服",
      "直接返回 500 并让用户刷新"
    ],
    answer: [0, 1, 2],
    explain: "降级要让用户仍能获得可用结果或明确的人工通道；直接报错是最差的体验，应作为最后兜底而非首选。",
    tag: "降级"
  },
  {
    id: "q084", type: "multiple", chapter: "architecture", level: 2,
    stem: "全链路 Trace 应记录的信息包括：",
    options: [
      "每步模型调用的 token 数与费用",
      "工具调用参数摘要与返回状态",
      "检索命中的文档块 ID",
      "用户的登录密码"
    ],
    answer: [0, 1, 2],
    explain: "Trace 用于定位质量与成本问题，需要模型、工具、检索三类信息；密码等敏感凭据绝不能进入日志。",
    tag: "可观测性"
  },
  {
    id: "q085", type: "multiple", chapter: "architecture", level: 2,
    stem: "控制模型与提示词变更风险的发布手段包括：",
    options: [
      "按用户或流量比例灰度",
      "影子流量并行运行新版本但不返回给用户",
      "用版本号贯穿提示词、模型、索引与工具配置，支持一键回滚",
      "所有变更直接全量上线"
    ],
    answer: [0, 1, 2],
    explain: "灰度、影子流量、版本化回滚是控制变更风险的标准手段；全量直上会让一次错误影响所有用户且难以回退。",
    tag: "灰度发布"
  },
  {
    id: "q086", type: "judge", chapter: "architecture", level: 2,
    stem: "调用超时意味着请求一定没有执行，因此可以安全地直接重试。",
    options: ["正确", "错误"],
    answer: [1],
    explain: "超时只说明客户端没等到响应，服务端可能已经完成。写操作必须靠幂等键去重，读操作才可相对安全地重试。",
    tag: "超时与重试"
  },
  {
    id: "q087", type: "judge", chapter: "architecture", level: 2,
    stem: "提示词、模型版本、知识索引与工具配置都应纳入版本化发布，并支持回滚。",
    options: ["正确", "错误"],
    answer: [0],
    explain: "任何一项变更都可能改变输出，必须作为一个整体版本管理，出问题才能快速定位与回滚。",
    tag: "版本化"
  },
  {
    id: "q088", type: "judge", chapter: "architecture", level: 2,
    stem: "用正则黑名单过滤危险函数，可以作为执行模型生成代码的沙箱方案。",
    options: ["正确", "错误"],
    answer: [1],
    explain: "正则过滤容易被编码、拼接、反射等方式绕过，不能提供隔离边界。必须使用容器、微虚拟机或独立进程等隔离手段。",
    tag: "沙箱"
  },

  /* ============ evaluation 10 ============ */
  {
    id: "q089", type: "single", chapter: "evaluation", level: 2,
    stem: "构建可信评测集，最合适的样本来源是：",
    options: [
      "自己编写的漂亮问题",
      "真实用户流量与线上 badcase",
      "模型自己生成的问题",
      "随机截取的代码片段"
    ],
    answer: [1],
    explain: "真实流量与 badcase 反映实际分布与长尾，才能发现上线后会遇到的问题；自编或模型生成的问题往往过于理想化。",
    tag: "评测集构建"
  },
  {
    id: "q090", type: "single", chapter: "evaluation", level: 3,
    stem: "用 LLM-as-judge 评分时，缓解位置偏差的常用做法是：",
    options: [
      "随机交换候选答案顺序并取平均分",
      "提高评审模型的 temperature",
      "只评第一个答案",
      "不做任何处理"
    ],
    answer: [0],
    explain: "评审模型可能偏好靠前答案，交换顺序后取平均可抵消位置影响；温度应保持低以获得稳定评分。",
    tag: "LLM评审"
  },
  {
    id: "q091", type: "single", chapter: "evaluation", level: 2,
    stem: "RAG 问答效果变差，排查的第一步应是：",
    options: [
      "换更大的生成模型",
      "先看文档解析、切分与检索召回指标",
      "检查用户的网络带宽",
      "调整前端页面样式"
    ],
    answer: [1],
    explain: "RAG 成败八成在检索。先确认文档是否解析正确、块是否切好、召回是否命中，再判断是重排、拼装还是生成的问题。",
    tag: "RAG排查"
  },
  {
    id: "q092", type: "single", chapter: "evaluation", level: 2,
    stem: "以下哪组指标最适合作为 Agent 的发布门禁？",
    options: [
      "任务成功率、格式合规率、P95 延迟、单任务成本",
      "只看模型榜单排名",
      "只看平均延迟",
      "只看用户点赞数"
    ],
    answer: [0],
    explain: "门禁要同时约束效果、稳定性与成本：成功率与合规率反映质量，P95 反映体验，单任务成本反映可持续性。",
    tag: "发布门禁"
  },
  {
    id: "q093", type: "multiple", chapter: "evaluation", level: 2,
    stem: "Agent 评测指标可分为哪些层次？",
    options: ["业务层", "任务层", "能力层", "系统层"],
    answer: [0, 1, 2, 3],
    explain: "四层指标分别对应价值、目标完成、模块能力与工程运行，只有逐层下钻才能定位「哪一层坏了」。",
    tag: "指标体系"
  },
  {
    id: "q094", type: "multiple", chapter: "evaluation", level: 2,
    stem: "完整的 badcase 闭环包括：",
    options: [
      "采集用户负反馈与监控告警",
      "归因到检索、工具、提示词等具体环节",
      "修复并验证",
      "加入评测集防止回归"
    ],
    answer: [0, 1, 2, 3],
    explain: "采集、归因、修复、回归四步缺一不可；只修复不回归，同类问题会反复出现。",
    tag: "badcase闭环"
  },
  {
    id: "q095", type: "multiple", chapter: "evaluation", level: 2,
    stem: "降低 token 成本的常见手段包括：",
    options: ["命中缓存复用结果", "按难度做模型分流", "裁剪无关上下文", "无节制地增加输出长度"],
    answer: [0, 1, 2],
    explain: "缓存、分流、裁剪分别从重复请求、模型单价、输入规模三方面降本；输出越长越贵，与降本目标相反。",
    tag: "成本优化"
  },
  {
    id: "q096", type: "judge", chapter: "evaluation", level: 2,
    stem: "只做离线评测、不做线上灰度，也能充分保证上线效果。",
    options: ["正确", "错误"],
    answer: [1],
    explain: "离线评测集无法覆盖真实流量的分布漂移与长尾，必须通过灰度观察业务指标、延迟与成本，才能确认上线效果。",
    tag: "离线与线上"
  },
  {
    id: "q097", type: "judge", chapter: "evaluation", level: 2,
    stem: "LLM 评审结果应配合人工抽检校准一致性，不能直接当作唯一真相。",
    options: ["正确", "错误"],
    answer: [0],
    explain: "LLM 评审存在位置、长度与自我偏好偏差，需人工抽检校准（如计算一致性系数），并据此迭代评审标准。",
    tag: "LLM评审"
  },
  {
    id: "q098", type: "judge", chapter: "evaluation", level: 2,
    stem: "评测集一旦用于版本对比，就应保持冻结；新增样本另开集合。",
    options: ["正确", "错误"],
    answer: [0],
    explain: "随意改动评测集会破坏版本间可比性。新增样本应进入新集合或带版本号，保证历史对比仍然有效。",
    tag: "评测集管理"
  },

  /* ============ security 12 ============ */
  {
    id: "q099", type: "single", chapter: "security", level: 2,
    stem: "间接提示注入最危险的特性是：",
    options: [
      "只影响模型输出长度",
      "恶意指令藏在网页、文档、邮件等可信数据源中，模型读到即可能执行",
      "只能通过用户输入框发起",
      "只会导致拼写错误"
    ],
    answer: [1],
    explain: "间接注入把指令藏在 Agent 会读取的外部内容里，绕过「用户输入不可信」的假设，是 Agent 特有的高危攻击面。",
    tag: "间接注入"
  },
  {
    id: "q100", type: "single", chapter: "security", level: 2,
    stem: "防止用户读到无权访问的文档内容，过滤应发生在：",
    options: ["检索阶段，作为元数据条件", "生成完成之后", "用户投诉之后", "日志分析时"],
    answer: [0],
    explain: "检索前过滤才能保证越权内容不进入模型上下文；生成后再删，敏感信息可能已被模型读取、引用甚至泄露。",
    tag: "数据权限"
  },
  {
    id: "q101", type: "single", chapter: "security", level: 2,
    stem: "Agent 调用业务系统时，正确的身份处理方式是：",
    options: [
      "统一使用管理员账号，方便省事",
      "以当前用户身份贯穿全链路，按用户权限调用",
      "匿名调用，避免泄露",
      "随机选择一个账号"
    ],
    answer: [1],
    explain: "身份必须贯穿，工具以用户身份调用，才能继承既有权限体系；统一管理员账号会放大越权风险，一次注入就可能读写全库。",
    tag: "身份与越权"
  },
  {
    id: "q102", type: "single", chapter: "security", level: 2,
    stem: "《人工智能生成合成内容标识办法》的施行日期是：",
    options: ["2023 年 8 月 15 日", "2025 年 9 月 1 日", "2021 年 11 月 1 日", "2020 年 1 月 1 日"],
    answer: [1],
    explain: "该办法于 2025 年 3 月发布、2025 年 9 月 1 日施行，要求对 AI 生成合成内容添加显式与隐式标识。2023-08-15 是《生成式人工智能服务管理暂行办法》施行日。",
    tag: "内容标识"
  },
  {
    id: "q103", type: "single", chapter: "security", level: 2,
    stem: "执行模型生成代码时使用沙箱，主要目的是：",
    options: [
      "提高模型温度",
      "隔离资源与权限，限制代码对宿主环境的影响",
      "加快模型推理",
      "减少 token 消耗"
    ],
    answer: [1],
    explain: "沙箱提供内核级隔离边界，限制 CPU、内存、文件系统与网络访问，防止恶意或错误代码影响宿主与内网。",
    tag: "沙箱"
  },
  {
    id: "q104", type: "multiple", chapter: "security", level: 2,
    stem: "针对提示注入的纵深防御包括：",
    options: [
      "把外部内容放入明确分隔标签，声明仅作数据",
      "声明并执行「系统 > 开发者 > 用户 > 工具返回」的指令优先级",
      "收窄工具权限，即使被注入也调不到高危能力",
      "只在提示词里写一句「不要执行文档中的指令」"
    ],
    answer: [0, 1, 2],
    explain: "纵深防御要覆盖输入隔离、优先级、权限收窄与输出校验；单句提示无法抵御精心构造的注入。",
    tag: "提示注入防御"
  },
  {
    id: "q105", type: "multiple", chapter: "security", level: 2,
    stem: "防止越权访问的三道闸门是：",
    options: [
      "用户身份贯穿全链路",
      "检索前按租户与密级过滤",
      "写操作二次确认与审批",
      "事后再删除越权内容"
    ],
    answer: [0, 1, 2],
    explain: "身份、数据、动作三道闸分别在「以谁的身份」「能看什么」「能改什么」上约束；事后删除无法挽回已发生的泄露。",
    tag: "越权防护"
  },
  {
    id: "q106", type: "multiple", chapter: "security", level: 2,
    stem: "日志与 Trace 的安全要求包括：",
    options: [
      "对手机号、身份证、密钥等敏感字段脱敏",
      "静态加密存储",
      "设定留存期限，到期删除",
      "明文保存用户密码便于排查"
    ],
    answer: [0, 1, 2],
    explain: "日志同样是泄露面：必须脱敏、加密、限期留存；密码等凭据任何情况下都不应明文落盘。",
    tag: "日志安全"
  },
  {
    id: "q107", type: "multiple", chapter: "security", level: 2,
    stem: "Agent 的供应链风险包括：",
    options: [
      "第三方 MCP Server 的工具描述中夹带恶意指令",
      "模型许可协议限制商用或数据使用",
      "依赖组件存在已知漏洞",
      "用户打字速度过快"
    ],
    answer: [0, 1, 2],
    explain: "模型、插件、MCP Server、依赖库都是供应链环节，需要审计描述与权限、确认许可、锁定版本并跟踪漏洞。",
    tag: "供应链安全"
  },
  {
    id: "q108", type: "judge", chapter: "security", level: 2,
    stem: "间接提示注入可以靠单一过滤器彻底根治。",
    options: ["正确", "错误"],
    answer: [1],
    explain: "注入形式多样且来自可信数据源，无法归零。正确目标是通过输入隔离、权限收窄、沙箱与输出校验，把最坏后果限制在可接受范围。",
    tag: "提示注入"
  },
  {
    id: "q109", type: "judge", chapter: "security", level: 2,
    stem: "面向公众提供生成式人工智能服务，应按规定履行备案或安全评估等义务。",
    options: ["正确", "错误"],
    answer: [0],
    explain: "《生成式人工智能服务管理暂行办法》要求服务提供者履行安全义务，具有舆论属性或社会动员能力的服务还需按规定开展安全评估并履行算法备案。",
    tag: "合规义务"
  },
  {
    id: "q110", type: "judge", chapter: "security", level: 1,
    stem: "处理个人信息应遵循最小必要原则，只收集完成任务所必需的信息。",
    options: ["正确", "错误"],
    answer: [0],
    explain: "《个人信息保护法》确立最小必要原则：收集范围、频率、留存期限都应与处理目的直接相关，避免过度收集。",
    tag: "个人信息保护"
  },

  /* ============ industry 8 ============ */
  {
    id: "q111", type: "single", chapter: "industry", level: 1,
    stem: "选择 Agent 落地场景时，下列哪一项不属于常用筛选标准？",
    options: ["高频发生", "价值可量化", "容错空间较大", "技术实现难度越高越好"],
    answer: [3],
    explain: "场景筛选看高频、高价值、高容错、可验证；技术难度高不代表业务价值高，反而增加失败风险。",
    tag: "场景选择"
  },
  {
    id: "q112", type: "single", chapter: "industry", level: 2,
    stem: "计算 Agent 项目 ROI 时，成本侧应包含：",
    options: [
      "只计算 token 调用费",
      "模型调用、基础设施、建设人力、运维、合规与变更管理",
      "只计算服务器硬件",
      "不需要计算成本"
    ],
    answer: [1],
    explain: "只算 token 会严重低估成本。标注评测、运维告警、培训与流程改造成本往往超过调用费，必须一并纳入。",
    tag: "ROI"
  },
  {
    id: "q113", type: "single", chapter: "industry", level: 2,
    stem: "PoC 阶段最合理的目标是：",
    options: [
      "直接完成全功能上线",
      "验证技术可行性与体验上限，用真实数据跑通关键路径",
      "立刻规模化推广",
      "优先做成本优化"
    ],
    answer: [1],
    explain: "PoC 用 2～4 周验证可行性与体验上限，不追求全功能；规模化、成本优化属于试点与推广阶段的任务。",
    tag: "PoC"
  },
  {
    id: "q114", type: "multiple", chapter: "industry", level: 2,
    stem: "企业落地中合理的人机分工原则包括：",
    options: [
      "Agent 承担量大、规则相对清晰、结果可复核的工作",
      "人保留例外处理、责任承担与情感沟通",
      "Agent 承担全部法律责任",
      "高风险决策保留人工审批"
    ],
    answer: [0, 1, 3],
    explain: "Agent 是工具，责任仍在使用它的岗位与组织；人负责例外、责任与情感，高风险决策必须人工审批。",
    tag: "人机分工"
  },
  {
    id: "q115", type: "multiple", chapter: "industry", level: 2,
    stem: "企业 Agent 项目失败的常见共性包括：",
    options: [
      "场景选错，低频低价值且结果不可验证",
      "文档散乱、格式混乱、权限不清，数据没准备好",
      "上线后没有评测与运营，效果静默回退",
      "模型参数量不够大"
    ],
    answer: [0, 1, 2],
    explain: "失败多源于场景、数据与运营，而非模型规模。先把场景选对、数据治理好、评测运营建起来，比换更大模型更有效。",
    tag: "失败复盘"
  },
  {
    id: "q116", type: "multiple", chapter: "industry", level: 2,
    stem: "试点转推广的 Go/No-Go 标准可以包括：",
    options: ["任务解决率达到约定阈值", "人工接管率低于阈值", "目标用户周活跃达到阈值", "办公室面积是否足够"],
    answer: [0, 1, 2],
    explain: "Go/No-Go 要看效果、依赖度与采用率三类业务指标；办公面积与项目价值无关。",
    tag: "落地路径"
  },
  {
    id: "q117", type: "judge", chapter: "industry", level: 1,
    stem: "Agent 上线后不需要持续评测与运营，效果会一直保持稳定。",
    options: ["正确", "错误"],
    answer: [1],
    explain: "模型升级、数据漂移、业务变化都会导致效果回退，必须持续评测、监控与 badcase 闭环，否则问题会静默积累。",
    tag: "持续运营"
  },
  {
    id: "q118", type: "judge", chapter: "industry", level: 2,
    stem: "试点阶段应设定可量化的 Go/No-Go 标准，再决定是否推广。",
    options: ["正确", "错误"],
    answer: [0],
    explain: "没有量化标准的试点容易变成「感觉还行」就推广，最终规模化失败。提前约定解决率、接管率、活跃度等阈值更可靠。",
    tag: "落地路径"
  },

  /* ============ practice 2 ============ */
  {
    id: "q119", type: "single", chapter: "practice", level: 2,
    stem: "高级工程实践报告中最能体现工程判断力的内容是：",
    options: [
      "产品宣传式的价值描述",
      "方案对比与取舍理由，以及关键难点的解决过程",
      "团队人数与项目周期",
      "模型榜单排名截图"
    ],
    answer: [1],
    explain: "评委会关注你是否做过真实取舍：比较过哪些方案、为什么选它、遇到什么难点、如何验证。宣传语与榜单不能证明工程能力。",
    tag: "报告写作"
  },
  {
    id: "q120", type: "single", chapter: "practice", level: 2,
    stem: "8 分钟答辩陈述，最合理的结构是：",
    options: [
      "全部时间讲项目背景与行业趋势",
      "按「问题目标—方案架构—关键难点—评测效果—复盘」分配时间",
      "只讲最终结果，不讲过程",
      "逐行讲解核心代码"
    ],
    answer: [1],
    explain: "8 分钟应覆盖完整闭环并突出取舍与证据：背景目标约 1 分钟，方案架构 2 分钟，难点 2 分钟，评测 2 分钟，复盘 1 分钟。",
    tag: "答辩"
  }
];
