import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

type SwaggerEntity = new (...args: any[]) => object;

export const ApiCustomResponses = (options: {
  summary: string;
  responses: {
    status: number;
    description: string;
    type?: SwaggerEntity | SwaggerEntity[];
  }[];
}) => {
  const { summary, responses } = options;

  const responseDecorators = responses.map((response) => {
    const isArray = Array.isArray(response.type);
    const type = isArray ? response.type[0] : response.type;

    return ApiResponse({
      status: response.status,
      description: response.description,
      type: isArray ? [type] : type,
    });
  });

  return applyDecorators(ApiOperation({ summary }), ...responseDecorators);
};
