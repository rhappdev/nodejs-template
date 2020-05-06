import { Router } from 'express';
import { getHelloWorldGet, getHelloWorldPost } from '../controllers/hello';
import { asyncHandler } from '../lib/asyncHandler';
export const helloWorldGet  = Router().use('/', asyncHandler(getHelloWorldGet, 'helloWorldGet'));
export const helloWorldPost  = Router().use('/', asyncHandler(getHelloWorldPost, 'helloWorldPost'));
