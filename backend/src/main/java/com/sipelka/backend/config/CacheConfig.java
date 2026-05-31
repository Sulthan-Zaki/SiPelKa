package com.sipelka.backend.config;

import org.springframework.cache.annotation.EnableCaching;
import org.springframework.context.annotation.Configuration;

/**
 * Enables Spring's caching abstraction. With no dedicated cache provider on the
 * classpath, Spring Boot auto-configures a simple in-memory ConcurrentMapCache
 * manager, which is sufficient for the small, read-heavy dashboard stats.
 *
 * The "proposalStats" cache is populated by {@code ProposalService.getStats()}
 * and evicted whenever a proposal is created, updated, or submitted.
 */
@Configuration
@EnableCaching
public class CacheConfig {
}
