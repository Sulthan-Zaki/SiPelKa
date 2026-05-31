package com.sipelka.backend.repository;

import com.sipelka.backend.model.ProgramHibah;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.UUID;

@Repository
public interface ProgramHibahRepository extends JpaRepository<ProgramHibah, UUID> {

    /**
     * Sum of all grant program ceilings, used as the "total ceiling" figure in
     * disbursement stats. Returns 0 (via COALESCE) when there are no programs.
     */
    @Query("SELECT COALESCE(SUM(h.totalDanaMaksimal), 0) FROM ProgramHibah h")
    BigDecimal sumTotalDanaMaksimal();
}
