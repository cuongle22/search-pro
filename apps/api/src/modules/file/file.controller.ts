import { Controller, Get, Param, Res } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Response } from 'express';
import { join } from 'path';

@Controller('files')
export class FileController {
  @Get(':filename')
  @ApiOperation({ summary: 'Get a file from the public folder' })
  @ApiResponse({ status: 200, description: 'Returns the requested file' })
  etFile(@Param('filename') filename: string, @Res() res: Response): void {
    //FIXME: This is a temporary solution, we should use a service to get the file
    const filePath = join(__dirname, '../../../', '..', 'public', filename);
    res.sendFile(filePath);
  }
}
