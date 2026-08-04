import { registerMvuSchema } from 'https://testingcf.jsdelivr.net/gh/StageDog/tavern_resource/dist/util/mvu_zod.js';

const 百分比进度Schema = z.coerce
  .number()
  .transform(value => _.clamp(value, 0, 100))
  .prefault(0);

const 炼药熟练度Schema = z.coerce
  .number()
  .transform(value => _.clamp(value, 0, 10000))
  .prefault(0);

const 基本信息Schema = z.object({
  姓名: z.string().prefault('未知'),
  性别: z.string().prefault('未知'),
  种族: z.string().prefault('未知'),
  身份: z.string().prefault('未知'),
  外貌: z.string().prefault('暂无描述'),
  背景: z.string().prefault('暂无背景'),
});

const 异火Schema = z.object({
  标签: z.string().prefault(''),
  描述: z.string().prefault('暂无描述'),
  效果: z.record(z.string(), z.any()).prefault({}),
});

const 状态Schema = z.object({
  类型: z.string().prefault('特殊'),
  描述: z.string().prefault('暂无描述'),
  效果: z.record(z.string(), z.any()).prefault({}),
  结束时间: z.string().prefault('未知'),
});

const 技能Schema = z.object({
  类型: z.string().prefault('特殊能力'),
  标签: z.string().prefault(''),
  描述: z.string().prefault('暂无描述'),
  效果: z.record(z.string(), z.any()).prefault({}),
});

const 装备Schema = z.object({
  类型: z.string().prefault('未知'),
  标签: z.string().prefault(''),
  描述: z.string().prefault('暂无描述'),
  效果: z.record(z.string(), z.any()).prefault({}),
});

const 物品Schema = z.object({
  类型: z.string().prefault('未知'),
  标签: z.string().prefault(''),
  描述: z.string().prefault('暂无描述'),
  效果: z.record(z.string(), z.any()).prefault({}),
});

const 修炼与状态Schema = z.object({
  斗气境界: z.string().prefault('未入门'),
  灵魂境界: z.string().prefault('未入门'),
  炼药术等级: z.string().prefault('未入门'),
  已吸收异火: z.record(z.string().describe('异火名'), 异火Schema).prefault({}),
  当前状态: z.record(z.string().describe('状态名称'), 状态Schema).prefault({}),
});

export const Schema = z.object({
  全局设定: z.any().prefault(null),
  世界状态: z
    .object({
      时间: z.string().prefault(''),
      位置: z.string().prefault(''),
    })
    .prefault({}),
  主角: z
    .object({
      基本信息: 基本信息Schema.prefault({}),
      斗气修炼: z
        .object({
          斗气境界: z.string().prefault('未入门'),
          修炼进度: 百分比进度Schema,
        })
        .prefault({}),
      灵魂力: z
        .object({
          灵魂境界: z.string().prefault('未入门'),
          凝聚进度: 百分比进度Schema,
        })
        .prefault({}),
      炼药术: z
        .object({
          炼药师等级: z.string().prefault('未入门'),
          熟练度: 炼药熟练度Schema,
        })
        .prefault({}),
      异火状态: z.record(z.string().describe('异火名'), 异火Schema).prefault({}),
      当前状态: z.record(z.string().describe('状态名称'), 状态Schema).prefault({}),
      技能与能力: z.record(z.string().describe('技能名称'), 技能Schema).prefault({}),
      装备信息: z.record(z.string().describe('装备名称'), 装备Schema).prefault({}),
      物品栏: z.record(z.string().describe('物品名称'), 物品Schema).prefault({}),
    })
    .prefault({}),
  任务契约: z.record(z.string().describe('任务名'), z.string().describe('任务详情')).prefault({}),
  关系列表: z
    .record(
      z.string().describe('NPC名称'),
      z.object({
        基本信息: 基本信息Schema
          .extend({
            与主角关系: z.string().prefault('陌生'),
          })
          .prefault({}),
        修炼与状态: 修炼与状态Schema.prefault({}),
        技能与能力: z.record(z.string().describe('技能名称'), 技能Schema).prefault({}),
        装备信息: z.record(z.string().describe('装备名称'), 装备Schema).prefault({}),
        物品栏: z.record(z.string().describe('物品名称'), 物品Schema).prefault({}),
      }),
    )
    .prefault({}),
});

$(() => {
  registerMvuSchema(Schema);
});
