import test from 'node:test';
import assert from 'node:assert';
import { aiService } from '../src/services/ai.ts';

test('AIService concurrency locking policy', async (t) => {
  let resolveDelete;
  const slowDeletePromise = new Promise((resolve) => {
    resolveDelete = resolve;
  });

  globalThis.caches = {
    keys: async () => ['webllm/model/test'],
    delete: async () => {
      await slowDeletePromise;
      return true;
    },
  };

  await t.test('sets lock synchronously and rejects concurrent init, generate, and delete', async () => {
    assert.strictEqual(aiService.isDeletingCache, false);
    assert.strictEqual(aiService.isBusy, false);

    const deletePromise = aiService.deleteModelCache();

    // 1. Lock should be set synchronously before first await completes
    assert.strictEqual(aiService.isDeletingCache, true);
    assert.strictEqual(aiService.isBusy, true);

    // 2. Simultaneous deleteModelCache should reject immediately
    await assert.rejects(
      () => aiService.deleteModelCache(),
      /Cache deletion is already in progress/
    );

    // 3. init() should reject immediately
    await assert.rejects(
      () => aiService.init(),
      /Cannot initialize AI Engine while cache deletion is in progress/
    );

    // 4. generateResponse() should reject immediately
    await assert.rejects(
      () => aiService.generateResponse('test message'),
      /Cannot generate response while cache deletion is in progress/
    );

    // Complete the slow delete
    resolveDelete();
    const result = await deletePromise;
    assert.strictEqual(result, true);

    // 5. Lock must be released in finally
    assert.strictEqual(aiService.isDeletingCache, false);
    assert.strictEqual(aiService.isBusy, false);
  });

  await t.test('releases lock in finally block even when deletion throws', async () => {
    globalThis.caches = {
      keys: async () => {
        throw new Error('Storage disk failure');
      },
      delete: async () => true,
    };

    assert.strictEqual(aiService.isDeletingCache, false);

    await assert.rejects(
      () => aiService.deleteModelCache(),
      /Storage disk failure/
    );

    // Lock must be released in finally block
    assert.strictEqual(aiService.isDeletingCache, false);
    assert.strictEqual(aiService.isBusy, false);
  });
});
