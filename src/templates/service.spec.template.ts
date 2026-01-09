import GeneratorHelper from '../utils/generator.helper';

/**
 * Generates a Jest unit test file for a NestJS service.
 * Tests all CRUD operations with mocked repository.
 * @param {string} tableName - The name of the database table (e.g., 'user_profiles').
 * @returns {string} A string containing the full TypeScript test file.
 */
export function generateServiceSpec(tableName: string): string {
  const className = GeneratorHelper.snakeToPascal(tableName);
  const camelName = GeneratorHelper.snakeToCamelCase(tableName);
  
  return `
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ${className}Service } from './${tableName}.service';
import { ${className} } from './entities/${tableName}.entity';
import { Create${className}Dto } from './dto/create-${tableName}.dto';
import { Update${className}Dto } from './dto/update-${tableName}.dto';

// Mock data
const mock${className}: ${className} = {
  id: '123e4567-e89b-12d3-a456-426614174000',
  created_at: new Date(),
  updated_at: new Date(),
  created_by: 'system',
  updated_by: 'system',
  // TODO: Add entity-specific properties
};

const mock${className}Array: ${className}[] = [
  mock${className},
  { ...mock${className}, id: '223e4567-e89b-12d3-a456-426614174001' },
];

const mockCreateDto: Create${className}Dto = {
  // TODO: Add DTO properties
};

const mockUpdateDto: Update${className}Dto = {
  // TODO: Add DTO properties
};

describe('${className}Service', () => {
  let service: ${className}Service;
  let repository: Repository<${className}>;

  const mockRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    findOneBy: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    remove: jest.fn(),
    count: jest.fn(),
    createQueryBuilder: jest.fn(() => ({
      where: jest.fn().mockReturnThis(),
      andWhere: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockReturnThis(),
      skip: jest.fn().mockReturnThis(),
      take: jest.fn().mockReturnThis(),
      getMany: jest.fn().mockResolvedValue(mock${className}Array),
      getCount: jest.fn().mockResolvedValue(mock${className}Array.length),
    })),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ${className}Service,
        {
          provide: getRepositoryToken(${className}),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<${className}Service>(${className}Service);
    repository = module.get<Repository<${className}>>(getRepositoryToken(${className}));

    // Reset all mocks before each test
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should successfully create a ${camelName}', async () => {
      mockRepository.create.mockReturnValue(mock${className});
      mockRepository.save.mockResolvedValue(mock${className});

      const result = await service.create(mockCreateDto);

      expect(result).toBeDefined();
      expect(mockRepository.save).toHaveBeenCalled();
    });

    it('should throw an error when creation fails', async () => {
      mockRepository.save.mockRejectedValue(new Error('Database error'));

      await expect(service.create(mockCreateDto)).rejects.toThrow();
    });
  });

  describe('findAll', () => {
    it('should return an array of ${camelName}s', async () => {
      mockRepository.find.mockResolvedValue(mock${className}Array);

      const result = await service.findAll();

      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
    });
  });

  describe('findOne', () => {
    it('should return a single ${camelName}', async () => {
      mockRepository.findOneBy.mockResolvedValue(mock${className});

      const result = await service.findOne(mock${className}.id);

      expect(result).toBeDefined();
      expect(result.id).toBe(mock${className}.id);
    });

    it('should throw NotFoundException when ${camelName} not found', async () => {
      mockRepository.findOneBy.mockResolvedValue(null);

      await expect(service.findOne('non-existent-id')).rejects.toThrow();
    });
  });

  describe('update', () => {
    it('should successfully update a ${camelName}', async () => {
      mockRepository.findOneBy.mockResolvedValue(mock${className});
      mockRepository.save.mockResolvedValue({ ...mock${className}, ...mockUpdateDto });

      const result = await service.update(mock${className}.id, mockUpdateDto);

      expect(result).toBeDefined();
      expect(mockRepository.save).toHaveBeenCalled();
    });

    it('should throw NotFoundException when ${camelName} not found', async () => {
      mockRepository.findOneBy.mockResolvedValue(null);

      await expect(service.update('non-existent-id', mockUpdateDto)).rejects.toThrow();
    });
  });

  describe('remove', () => {
    it('should successfully remove a ${camelName}', async () => {
      mockRepository.findOneBy.mockResolvedValue(mock${className});
      mockRepository.remove.mockResolvedValue(mock${className});

      const result = await service.remove(mock${className}.id);

      expect(result).toBeDefined();
      expect(mockRepository.remove).toHaveBeenCalled();
    });

    it('should throw NotFoundException when ${camelName} not found', async () => {
      mockRepository.findOneBy.mockResolvedValue(null);

      await expect(service.remove('non-existent-id')).rejects.toThrow();
    });
  });

  describe('count', () => {
    it('should return the total count', async () => {
      mockRepository.count.mockResolvedValue(10);

      const result = await service.count();

      expect(result).toBe(10);
    });
  });

  describe('getStatistics', () => {
    it('should return statistics object', async () => {
      mockRepository.count.mockResolvedValue(100);

      const result = await service.getStatistics();

      expect(result).toBeDefined();
      expect(result).toHaveProperty('total');
    });
  });
});
`;
}
