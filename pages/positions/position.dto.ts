export interface PositionItemDTO {
    id: string;
    title: string;           // 职位名称
    organization: string;    // 机构名称
    salary: {
      min: number;
      max: number;
    };
    requirements: {
      gender: 'male' | 'female' | 'any';  // 性别要求
      education: string;     // 学历要求
      ageRange: {
        min: number;
        max: number;
      };
    };
    basePrice: number;      // 底价
    deadline?: string;      // 截止时间
    status?: string;        // 名额候补中等状态
  }