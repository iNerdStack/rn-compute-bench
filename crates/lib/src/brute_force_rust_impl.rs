use craby::prelude::*;
use crate::ffi::bridging::*;
use crate::generated::*;
use md5::compute;
use std::sync::atomic::{AtomicBool, Ordering};
use std::sync::Arc;
use std::time::Instant;
use std::thread;

pub struct BruteForceRust {
    ctx: Context,
    should_cancel: Arc<AtomicBool>,
}

// Character set for brute force: 0-9, a-z, A-Z
const CHARSET: &[u8] = b"0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";

#[craby_module]
impl BruteForceRustSpec for BruteForceRust {
    fn new(ctx: Context) -> Self {
        Self {
            ctx,
            should_cancel: Arc::new(AtomicBool::new(false)),
        }
    }

    fn brute_force_hash(&mut self, target_hash: &str, max_length: Number) -> Promise<BruteForceResult> {
        let target = target_hash.to_string();
        let max_len = max_length as usize;
        let should_cancel = self.should_cancel.clone();
        should_cancel.store(false, Ordering::Relaxed);

        // Spawn computation on a separate thread using std::thread
        let handle = thread::spawn(move || {
            let start_time = Instant::now();
            let mut attempts: u64 = 0;

            // Try each length from 1 to max_length
            for length in 1..=max_len {
                if let Some(result) = try_length(
                    &target,
                    length,
                    &mut attempts,
                    &should_cancel,
                    start_time,
                ) {
                    return result;
                }

                // Check if cancelled
                if should_cancel.load(Ordering::Relaxed) {
                    break;
                }
            }

            // Not found
            let elapsed = start_time.elapsed();
            BruteForceResult {
                found: false,
                plaintext: String::new(),
                attempts: attempts as f64,
                time_ms: elapsed.as_millis() as f64,
                checks_per_second: calculate_rate(attempts, elapsed.as_secs_f64()),
            }
        });

        // Wait for the thread to finish and return the result
        Ok(handle.join().unwrap())
    }

    fn cancel_brute_force(&mut self) -> Void {
        self.should_cancel.store(true, Ordering::Relaxed);
    }

    fn generate_md_5(&mut self, input: &str) -> String {
        format!("{:x}", compute(input.as_bytes()))
    }
}

fn try_length(
    target_hash: &str,
    length: usize,
    attempts: &mut u64,
    should_cancel: &Arc<AtomicBool>,
    start_time: Instant,
) -> Option<BruteForceResult> {
    let mut current = vec![0usize; length];

    loop {
        // Check if cancelled every 10000 attempts for better performance
        if *attempts % 10000 == 0 && should_cancel.load(Ordering::Relaxed) {
            return None;
        }

        // Build current string
        let test_str: String = current
            .iter()
            .map(|&i| CHARSET[i] as char)
            .collect();

        // Hash and compare
        let hash = format!("{:x}", compute(test_str.as_bytes()));
        *attempts += 1;

        if hash == target_hash {
            let elapsed = start_time.elapsed();
            return Some(BruteForceResult {
                found: true,
                plaintext: test_str,
                attempts: *attempts as f64,
                time_ms: elapsed.as_millis() as f64,
                checks_per_second: calculate_rate(*attempts, elapsed.as_secs_f64()),
            });
        }

        // Increment to next combination
        if !increment_combination(&mut current, CHARSET.len()) {
            break;
        }
    }

    None
}

fn increment_combination(current: &mut [usize], base: usize) -> bool {
    for i in (0..current.len()).rev() {
        current[i] += 1;
        if current[i] < base {
            return true;
        }
        current[i] = 0;
    }
    false
}

fn calculate_rate(attempts: u64, seconds: f64) -> f64 {
    if seconds > 0.0 {
        attempts as f64 / seconds
    } else {
        0.0
    }
}
