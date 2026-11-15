package com.umc.movie.dto;

import java.util.List;

public record RatingPageResponse(
        List<RatingResponse> content,
        int page,
        int size,
        long totalElements,
        int totalPages,
        boolean last
) {}