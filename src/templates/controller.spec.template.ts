import GeneratorHelper from '../utils/generator.helper';

/**
 * Generates a Jest unit test file for a NestJS controller.
 * Tests all endpoints with mocked service.
 * @param {string} tableName - The name of the database table (e.g., 'user_profiles').
 * @returns {string} A string containing the full TypeScript test file.
 */
export function generateControllerSpec(tableName: string): string {
  const className = GeneratorHelper.snakeToPascal(tableName);
  const camelName = GeneratorHelper.snakeToCamelCase(tableName);
  
  return `
import { Test, TestingModule } from '@nestjs/testing';
import { ${className}Controller } from './${tableName}.controller';
import { ${className}Service } from './${tableName}.service';
import { Create${className}Dto } from './dto/create-${tableName}.dto';
import { Update${className}Dto } from './dto/update-${tableName}.dto';
import { Read${className}Dto } from './dto/read-${tableName}.dto';

// Mock response data
const mockRead${className}Dto: Read${className}Dto = {
  id: '123e4567-e89b-12d3-a456-426614174000',
  created_at: new Date(),
  updated_at: new Date(),
  created_by: 'system',
  updated_by: 'system',
  // TODO: Add DTO-specific properties
};

const mockRead${className}DtoArray: Read${className}Dto[] = [
  mockRead${className}Dto,
  { ...mockRead${className}Dto, id: '223e4567-e89b-12d3-a456-426614174001' },
];

const mockPageResult = {
  data: mockRead${className}DtoArray,
  count: 2,
};

describe('${className}Controller', () => {
  let controller: ${className}Controller;
  let service: ${className}Service;

  const mockService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    findAllBy: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    page: jest.fn(),
    searchBy: jest.fn(),
    count: jest.fn(),
    countWithWhereAndRelations: jest.fn(),
    getStatistics: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [${className}Controller],
      providers: [
        {
          provide: ${className}Service,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<${className}Controller>(${className}Controller);
    service = module.get<${className}Service>(${className}Service);

    // Reset all mocks before each test
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a new ${camelName}', async () => {
      const createDto: Create${className}Dto = {
        // TODO: Add DTO properties
      };
      mockService.create.mockResolvedValue(mockRead${className}Dto);

      const result = await controller.create(createDto);

      expect(result).toEqual(mockRead${className}Dto);
      expect(mockService.create).toHaveBeenCalledWith(createDto);
    });
  });

  describe('findAll', () => {
    it('should return an array of ${camelName}s', async () => {
      mockService.findAll.mockResolvedValue(mockRead${className}DtoArray);

      const result = await controller.findAll();

      expect(result).toEqual(mockRead${className}DtoArray);
      expect(mockService.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a single ${camelName}', async () => {
      mockService.findOne.mockResolvedValue(mockRead${className}Dto);

      const result = await controller.findOne(mockRead${className}Dto.id);

      expect(result).toEqual(mockRead${className}Dto);
      expect(mockService.findOne).toHaveBeenCalledWith(mockRead${className}Dto.id);
    });
  });

  describe('findAllBy', () => {
    it('should return ${camelName}s filtered by key-value', async () => {
      mockService.findAllBy.mockResolvedValue(mockRead${className}DtoArray);

      const result = await controller.findAllBy('id' as any, 'test-value');

      expect(result).toEqual(mockRead${className}DtoArray);
      expect(mockService.findAllBy).toHaveBeenCalledWith('id', 'test-value');
    });
  });

  describe('page', () => {
    it('should return paginated results', async () => {
      mockService.page.mockResolvedValue(mockPageResult);

      const result = await controller.page('base64-encoded-filter');

      expect(result).toEqual(mockPageResult);
      expect(mockService.page).toHaveBeenCalledWith('base64-encoded-filter');
    });
  });

  describe('search', () => {
    it('should return search results', async () => {
      mockService.searchBy.mockResolvedValue(mockRead${className}DtoArray);

      const result = await controller.search('base64-encoded-filter');

      expect(result).toEqual(mockRead${className}DtoArray);
      expect(mockService.searchBy).toHaveBeenCalledWith('base64-encoded-filter');
    });
  });

  describe('count', () => {
    it('should return count without filter', async () => {
      mockService.count.mockResolvedValue(10);

      const result = await controller.count();

      expect(result).toBe(10);
      expect(mockService.count).toHaveBeenCalled();
    });

    it('should return count with filter', async () => {
      mockService.countWithWhereAndRelations.mockResolvedValue(5);

      const result = await controller.count('base64-encoded-filter');

      expect(result).toBe(5);
      expect(mockService.countWithWhereAndRelations).toHaveBeenCalledWith('base64-encoded-filter');
    });
  });

  describe('update', () => {
    it('should update a ${camelName}', async () => {
      const updateDto: Update${className}Dto = {
        // TODO: Add DTO properties
      };
      mockService.update.mockResolvedValue({ ...mockRead${className}Dto, ...updateDto });

      const result = await controller.update(mockRead${className}Dto.id, updateDto);

      expect(result).toBeDefined();
      expect(mockService.update).toHaveBeenCalledWith(mockRead${className}Dto.id, updateDto);
    });
  });

  describe('remove', () => {
    it('should remove a ${camelName}', async () => {
      mockService.remove.mockResolvedValue(mockRead${className}Dto);

      const result = await controller.remove(mockRead${className}Dto.id);

      expect(result).toEqual(mockRead${className}Dto);
      expect(mockService.remove).toHaveBeenCalledWith(mockRead${className}Dto.id);
    });
  });

  describe('getStatistics', () => {
    it('should return statistics', async () => {
      const mockStats = { total: 100 };
      mockService.getStatistics.mockResolvedValue(mockStats);

      const result = await controller.getStatistics();

      expect(result).toEqual(mockStats);
      expect(mockService.getStatistics).toHaveBeenCalled();
    });
  });
});
`;
}
