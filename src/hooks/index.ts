import { PickerSelectItem } from "@/types";

/** 城市数据 */
export function useCityData(): Array<PickerSelectItem> {
  return [
    {
      label: "广东省",
      value: 0,
      children: [
        {
          label: "广州市",
          value: 0,
          children: [
            {
              label: "天河区",
              value: 0
            },
            {
              label: "番禺区",
              value: 1
            },
            {
              label: "白云区",
              value: 2
            }
          ]
        },
        {
          label: "深圳市",
          value: 1,
          children: [
            {
              label: "保安区",
              value: 0
            },
            {
              label: "龙华区",
              value: 1
            },
            {
              label: "福田区",
              value: 2
            }
          ]
        },
        {
          label: "其他",
          value: 2
        }
      ]
    },
    {
      label: "湖南省",
      value: 1,
      children: [
        {
          label: "长沙市",
          value: 0,
          children: [
            {
              label: "芙蓉区",
              value: 0
            },
            {
              label: "天心区",
              value: 1
            },
            {
              label: "岳麓区",
              value: 2
            }
          ]
        },
        {
          label: "衡阳市",
          value: 1,
          children: [
            {
              label: "衡阳县",
              value: 0
            },
            {
              label: "衡南县",
              value: 1
            },
            {
              label: "衡山县",
              value: 2
            }
          ]
        }
      ]
    },
    {
      label: "黑龙江省",
      value: 1,
      children: [
        {
          label: "哈尔滨市",
          value: 0,
          children: [
            {
              label: "道外区",
              value: 0
            },
            {
              label: "松北区",
              value: 1
            },
            {
              label: "呼兰区",
              value: 2
            }
          ]
        },
        {
          label: "沈阳市",
          value: 1,
        }
      ]
    },
    {
      label: '浙江省',
      value: 12,
    }
  ]
}